import naissanceRepository from '../repositories/naissanceRepository.js';
import { generateHash } from '../../../common/utils/hash.js';
import { generateQRCode } from '../../../common/services/qrService.js';
import { encryptRecord, decryptRecord } from '../../../common/utils/encryption.js';
import { naissanceContract } from '../../../config/blockchain.js';

class NaissanceService {
  async registerBirth(data) {
    // 1. Generate unique ID (Simplified for now)
    const idActe = data.idActe || `GN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // 2. Compute Hash of necessary data
    const hashData = {
      prenom: data.prenom,
      nom: data.nom,
      sexe: data.sexe,
      dateNaissance: data.dateNaissance,
      heureNaissance: data.heureNaissance,
      lieuNaissance: data.lieuNaissance, // Object with region, prefecture, sousPrefecture
      nationaliteEnfant: data.nationaliteEnfant,
      mere: {
        nom: data.mere.nom,
        dateNaissance: data.mere.dateNaissance,
        id: data.mere.id
      },
      pere: {
        nom: data.pere.nom,
        dateNaissance: data.pere.dateNaissance,
        id: data.pere.id
      },
      declarant: data.declarant
    };
    const hashDonnees = generateHash(hashData);

    // 3. Generate QR Code
    const qrCode = await generateQRCode(idActe);

    // 4. Determine status
    const status = data.agentId.startsWith('PARENT-') ? 'PENDING' : 'APPROVED';

    // 5. Save to Database
    const naissance = await naissanceRepository.create({
      ...data,
      idActe,
      hashDonnees,
      qrCode,
      status,
      blockchainValidated: false
    });

    // 6. Encrypt data for Blockchain Backup
    const encryptedData = encryptRecord(hashData);

    // 7. Send to Blockchain (Only if APPROVED)
    if (status === 'APPROVED') {
        this.processBlockchainTransaction(idActe, hashDonnees, encryptedData, data.prefecture, data.agentId);
    }

    return naissance;
  }

  async approveBirth(idActe) {
    const record = await naissanceRepository.findByIdActe(idActe);
    if (!record) throw new Error('Acte non trouvé');
    if (record.status !== 'PENDING') throw new Error('Cet acte n\'est pas en attente d\'approbation');

    // Update status to APPROVED
    const updatedRecord = await naissanceRepository.update(idActe, { status: 'APPROVED' });

    // Prepare data for blockchain
    const hashData = {
        prenom: updatedRecord.prenom,
        nom: updatedRecord.nom,
        sexe: updatedRecord.sexe,
        dateNaissance: updatedRecord.dateNaissance,
        heureNaissance: updatedRecord.heureNaissance,
        lieuNaissance: updatedRecord.lieuNaissance,
        nationaliteEnfant: updatedRecord.nationaliteEnfant,
        mere: updatedRecord.mere,
        pere: updatedRecord.pere,
        declarant: updatedRecord.declarant
    };
    const encryptedData = encryptRecord(hashData);

    // Process blockchain transaction
    this.processBlockchainTransaction(idActe, updatedRecord.hashDonnees, encryptedData, updatedRecord.prefecture, updatedRecord.agentId);

    return updatedRecord;
  }

  async rejectBirth(idActe, motif) {
    const record = await naissanceRepository.findByIdActe(idActe);
    if (!record) throw new Error('Acte non trouvé');
    if (record.status !== 'PENDING') throw new Error('Cet acte n\'est pas en attente d\'approbation');

    return await naissanceRepository.update(idActe, { 
        status: 'REJECTED',
        rejectionMotif: motif 
    });
  }

  async processBlockchainTransaction(idActe, hashDonnees, encryptedData, prefecture, agentId) {
    try {
      console.log(`Sending to blockchain: ${idActe}`);
      const tx = await naissanceContract.enregistrerNaissance(
        idActe,
        hashDonnees,
        encryptedData,
        prefecture,
        agentId
      );

      console.log(`Transaction sent: ${tx.hash}`);

      // Update DB with transaction hash
      await naissanceRepository.update(idActe, {
        txHash: tx.hash,
        blockchainValidated: true
      });

      // Wait for confirmation
      await tx.wait();
      console.log(`Transaction confirmed: ${tx.hash}`);
    } catch (error) {
      console.error('Blockchain Error:', error);
    }
  }

  async getBirthRecord(idActe) {
    const record = await naissanceRepository.findByIdActe(idActe);
    if (!record) throw new Error('Acte non trouvé');
    return record;
  }

  async verifyIntegrity(idActe) {
    const localRecord = await naissanceRepository.findByIdActe(idActe);
    if (!localRecord) return { valide: false, message: "Acte non trouvé localement" };

    try {
      // Fetch from Blockchain
      const [valide, hashBlockchain, encryptedData, prefecture, date] = await naissanceContract.verifierNaissance(idActe);

      if (!valide) return { valide: false, message: "Acte non trouvé sur la blockchain" };

      // Re-calculate hash of local data
      const hashData = {
        prenom: localRecord.prenom,
        nom: localRecord.nom,
        sexe: localRecord.sexe,
        dateNaissance: localRecord.dateNaissance,
        heureNaissance: localRecord.heureNaissance,
        lieuNaissance: localRecord.lieuNaissance,
        nationaliteEnfant: localRecord.nationaliteEnfant,
        mere: {
          nom: localRecord.mere.nom,
          dateNaissance: localRecord.mere.dateNaissance,
          id: localRecord.mere.id
        },
        pere: {
          nom: localRecord.pere.nom,
          dateNaissance: localRecord.pere.dateNaissance,
          id: localRecord.pere.id
        },
        declarant: localRecord.declarant
      };
      const currentLocalHash = generateHash(hashData);

      if (currentLocalHash === hashBlockchain) {
        return {
          valide: true,
          data: localRecord,
          blockchainInfo: { prefecture, date: new Date(Number(date) * 1000) }
        };
      }
    } catch (error) {
      console.error('Verification Error:', error);
      throw new Error('Erreur lors de la vérification blockchain');
    }
  }

  async restoreAllFromBlockchain() {
    console.log("🚀 Starting Blockchain Data Restoration...");
    const stats = { restored: 0, skipped: 0, errors: 0 };

    try {
      const total = await naissanceContract.totalActes();
      console.log(`📡 Found ${total} records on-chain.`);

      for (let i = 0; i < total; i++) {
        try {
          const idActe = await naissanceContract.tousLesActes(i);
          
          // Check if already in DB
          const exists = await naissanceRepository.findByIdActe(idActe);
          if (exists) {
            stats.skipped++;
            continue;
          }

          // Fetch encrypted data from chain
          const [valide, hash, encrypted, pref, date] = await naissanceContract.verifierNaissance(idActe);
          
          if (!valide) {
            console.error(`❌ Record ${idActe} not valid on-chain.`);
            stats.errors++;
            continue;
          }

          // Decrypt
          const decryptedData = decryptRecord(encrypted);
          
          // Re-generate QR Code
          const qrCode = await generateQRCode(idActe);

          // Restore to Database
          await naissanceRepository.create({
            ...decryptedData,
            idActe,
            hashDonnees: hash,
            qrCode,
            prefecture: pref,
            agentId: "RESTORED-FROM-BLOCKCHAIN",
            blockchainValidated: true,
            createdAt: new Date(Number(date) * 1000)
          });

          console.log(`✅ Restored: ${idActe}`);
          stats.restored++;
        } catch (err) {
          console.error(`⚠️ Error restoring record at index ${i}:`, err.message);
          stats.errors++;
        }
      }

      return stats;
    } catch (error) {
      console.error('Fatal Restoration Error:', error);
      throw new Error('Restoration process failed');
    }
  }
}

export default new NaissanceService();
