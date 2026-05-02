import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Testing from 'expo-sharing';

export const generateCertificatePDF = async (record: any) => {
  const today = new Date().toLocaleDateString('fr-FR');
  const certNumber = `B${record.idActe?.replace(/\D/g, '') || '0000000000'}`;
  const ninNumber  = `${record.idActe?.replace(/\D/g, '') || ''}000`;
  const agent = record.agentId?.identifier || record.agentId || 'OFFICIER NAISSANCECHAIN';
  const prefecture = (record.lieuNaissance?.prefecture || 'N/A').toUpperCase();
  const sousPref   = (record.lieuNaissance?.sousPrefecture || 'N/A').toUpperCase();
  const declarantNom  = record.declarant?.nom || record.pere?.nom || 'NON DÉCLARÉ';
  const declarantLien = record.declarant?.lien || 'PÈRE';

  const qrTag = record.qrCode
    ? `<img src="${record.qrCode}" style="width:80px;height:80px;display:block;" />`
    : `<div style="width:80px;height:80px;background:#ddd;display:flex;align-items:center;justify-content:center;font-size:9px;">QR CODE</div>`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Acte de Naissance - ${record.idActe}</title>
<style>
  @page { margin: 0; size: A4 portrait; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5px; }

  .page {
    width: 210mm;
    height: 297mm; /* Fixed height to prevent overflow to next page */
    position: relative;
    background-color: #fff;
    border: 1mm solid #333;
    margin: 3mm;
  }

  /* Transparent overlay for readability */
  .overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
  }

  .content {
    position: relative;
    z-index: 2;
    padding: 30px 45px 15px 45px; /* Reduced paddings */
  }

  /* ---- Top barcode area ---- */
  .top-meta {
    text-align: right;
    font-size: 8px;
    line-height: 1.6;
    color: #111;
    margin-bottom: 4px;
  }
  .barcode {
    display: inline-block;
    height: 18px;
    width: 160px;
    background: repeating-linear-gradient(
      90deg, #000 0,#000 2px, #fff 2px, #fff 3px,
      #000 3px, #000 5px, #fff 5px, #fff 7px,
      #000 7px, #000 8px, #fff 8px, #fff 10px,
      #000 10px, #000 13px, #fff 13px, #fff 14px,
      #000 14px, #000 15px
    );
    vertical-align: middle;
    margin-bottom: 3px;
  }

  /* ---- Titles ---- */
  .titles {
    text-align: center;
    margin-bottom: 8px; /* Reduced margin */
  }
  .title-main {
    font-family: 'Times New Roman', Georgia, serif;
    font-size: 22pt; /* Slightly smaller */
    font-style: italic;
    font-weight: bold;
    color: #111;
  }
  .title-cert {
    font-family: 'Times New Roman', Georgia, serif;
    font-size: 10pt; /* Slightly smaller */
    font-style: italic;
    color: #444;
  }
  .title-acte {
    font-size: 13pt; /* Slightly smaller */
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #000;
    margin-top: 2px;
  }

  /* ---- Table ---- */
  table { width:100%; border-collapse:collapse; background: #fff; }
  td { border: 1px solid #444; padding: 2.2px 6px; vertical-align:top; font-size:9.5px; line-height:1.4; }

  .sec-head {
    background-color: #f3f4f6 !important;
    text-align: center;
    font-weight: bold;
    font-size: 10px;
    letter-spacing: 2px;
    padding: 3px !important;
  }
  .b { font-weight: bold; }
  .l { color: #333; }

  /* ---- Footer ---- */
  .footer { margin-top: 8px; position: relative; } /* Reduced margin */
  .footer-date { font-size: 9px; margin-bottom: 2px; }
  .footer-officier { font-size: 9px; margin-bottom: 8px; } /* Reduced spacing */

  .stamps-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 10px;
  }

  .sig-area { flex: 1; font-size: 18pt; font-style: italic; color: #1a3a6e; font-family: Georgia, serif; }

  .qr-area { display:flex; flex-direction:column; align-items:center; gap:3px; }
  .qr-num { font-size: 7px; font-family: 'Courier New', monospace; color:#333; }

  .hash-line {
    font-size: 7px;
    font-family: 'Courier New', monospace;
    color: #006a40;
    word-break: break-all;
    border-top: 1px solid rgba(0,0,0,0.2);
    padding-top: 5px;
    margin-top: 8px;
    font-weight: bold;
  }
</style>
</head>
<body>
<div class="page">
  <div class="content">

    <!-- Barcode + meta top right -->
    <div class="top-meta">
      <span class="barcode"></span><br>
      Numéro de certificat : <b>${certNumber}</b><br>
      République de Guinée<br>
      Numéro d'identification National : ${ninNumber}
    </div>

    <!-- Titles -->
    <div class="titles">
      <div class="title-main">Acte de Naissance</div>
      <div class="title-cert">Certificate of Birth</div>
      <div class="title-acte">Acte De Naissance</div>
    </div>

    <!-- TABLE -->
    <table>
      <!-- Ville / Je Soussigné -->
      <tr>
        <td style="width:50%;border-right:2px solid #333;">
          <b>Ville / Préfecture : ${prefecture}</b><br>
          <b>Commune : ${sousPref}</b>
        </td>
        <td style="text-align:right;"><b>Je Soussigné : ${agent.toUpperCase()}</b></td>
      </tr>

      <!-- ENFANT -->
      <tr><td colspan="2" class="sec-head">ENFANT</td></tr>
      <tr><td colspan="2"><span class="l">Prénoms : </span><b>${record.prenom || ''}</b></td></tr>
      <tr><td colspan="2"><span class="l">Nom : </span><b>${record.nom || ''}</b></td></tr>
      <tr>
        <td>
          <span class="l">Lieu de naissance : Région de : <b>${prefecture}</b></span><br>
          <span class="l">&nbsp;&nbsp;Préfecture : <b>${prefecture}</b></span><br>
          <span class="l">&nbsp;&nbsp;Sous-préfecture : <b>${sousPref}</b></span>
        </td>
        <td>
          <span class="l">Date et Heure de Naissance : </span>
          <b>${record.dateNaissance || 'N/A'} ${record.heureNaissance || '--:--'}</b>
        </td>
      </tr>
      <tr>
        <td><span class="l">Sexe : </span><b>${record.sexe === 'M' ? 'MASCULIN' : 'FÉMININ'}</b></td>
        <td><span class="l">Nationalité : </span><b>${record.nationaliteEnfant || 'GUINÉENNE'}</b></td>
      </tr>

      <!-- PÈRE -->
      <tr><td colspan="2" class="sec-head">PÈRE</td></tr>
      <tr><td colspan="2"><span class="l">Nom : </span><b>${record.pere?.nom || 'NON DÉCLARÉ'}</b></td></tr>
      <tr>
        <td><span class="l">Date de naissance : ${record.pere?.dateNaissance || 'N/A'}</span></td>
        <td><span class="l">CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</span></td>
      </tr>
      <tr>
        <td><span class="l">Numéro d'identification : NA</span></td>
        <td></td>
      </tr>
      <tr>
        <td><span class="l">Nationalité : GUINÉENNE</span></td>
        <td><span class="l">Profession : <b>${record.pere?.profession || 'N/A'}</b></span></td>
      </tr>

      <!-- MÈRE -->
      <tr><td colspan="2" class="sec-head">MÈRE</td></tr>
      <tr><td colspan="2"><span class="l">Nom : </span><b>${record.mere?.nom || 'NON DÉCLARÉ'}</b></td></tr>
      <tr>
        <td><span class="l">Date de naissance : ${record.mere?.dateNaissance || 'N/A'}</span></td>
        <td><span class="l">CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</span></td>
      </tr>
      <tr>
        <td><span class="l">Numéro d'identification : NA</span></td>
        <td></td>
      </tr>
      <tr>
        <td><span class="l">Nationalité : GUINÉENNE</span></td>
        <td><span class="l">Profession : <b>${record.mere?.profession || 'N/A'}</b></span></td>
      </tr>
      <tr>
        <td>
          <span class="l">Adresses du parent : Région de : <b>${prefecture}</b></span><br>
          <span class="l">&nbsp;&nbsp;Préfecture : <b>${prefecture}</b></span><br>
          <span class="l">&nbsp;&nbsp;Sous-préfecture : <b>${sousPref}</b></span>
        </td>
        <td>
          <span class="l">Quartier/District : N/A</span><br>
          <span class="l">Secteur/Village : N/A</span>
        </td>
      </tr>

      <!-- DÉCLARANT -->
      <tr><td colspan="2" class="sec-head">DÉCLARANT</td></tr>
      <tr><td colspan="2"><span class="l">Nom : </span><b>${declarantNom}</b></td></tr>
      <tr>
        <td><span class="l">Numéro d'identification : NA</span></td>
        <td><span class="l">CNI ou autres : A PARTIR DU FORMULAIRE DE DEMANDE</span></td>
      </tr>
      <tr>
        <td><span class="l">Lien de Parenté : <b>${declarantLien}</b></span></td>
        <td></td>
      </tr>

      <!-- APPROUVÉ PAR -->
      <tr><td colspan="2" class="sec-head">APPROUVÉ PAR</td></tr>
      <tr><td colspan="2" style="height:26px;"></td></tr>
    </table>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-date">Dressé le : ${today}</div>
      <div class="footer-officier">Officier de l'Etat Civil Délégué</div>
      <div class="stamps-row">
        <div class="sig-area">~Certifié~</div>
        <div class="qr-area">
          ${qrTag}
          <div class="qr-num">${record.idActe}</div>
        </div>
      </div>
      <div class="hash-line">
        ✓ CERTIFIÉ NAISSANCECHAIN | BLOCKCHAIN SEPOLIA | HASH : ${record.txHash || record.hashDonnees || 'En attente...'}
      </div>
    </div>

  </div>
</div>
</body>
</html>`;

  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: `Acte de naissance - ${record.prenom} ${record.nom}`,
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
