import mongoose from 'mongoose';

const NaissanceSchema = new mongoose.Schema({
  idActe: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Enfant
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  sexe: { type: String, enum: ['M', 'F'], required: true },
  dateNaissance: { type: String, required: true },
  heureNaissance: { type: String, required: true },
  lieuNaissance: {
    region: { type: String, required: true },
    prefecture: { type: String, required: true },
    sousPrefecture: { type: String, required: true }
  },
  nationaliteEnfant: { type: String, default: 'GUINÉENNE' },
  numeroNationalEnfant: { type: String },

  // Parents
  mere: {
    nom: { type: String, required: true },
    dateNaissance: { type: String },
    id: { type: String },
    nationalite: { type: String, default: 'GUINÉENNE' },
    profession: { type: String }
  },
  pere: {
    nom: { type: String },
    dateNaissance: { type: String },
    id: { type: String },
    nationalite: { type: String, default: 'GUINÉENNE' },
    profession: { type: String }
  },

  // Localisation Parents
  adresseParents: {
    region: { type: String, required: true },
    prefecture: { type: String, required: true },
    sousPrefecture: { type: String, required: true },
    quartier: { type: String, required: true },
    secteur: { type: String, required: true }
  },

  // Déclarant
  declarant: {
    nom: { type: String, required: true },
    id: { type: String },
    lien: { type: String, required: true } // ex: PERE, MERE, etc.
  },

  // Méta
  prefecture: { type: String, required: true },
  agentId: { type: String, required: true },
  hashDonnees: { type: String, required: true },
  txHash: { type: String },
  qrCode: { type: String }, // Base64 string
  dateEnregistrement: { type: Date, default: Date.now },
  blockchainValidated: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'APPROVED' 
  }
}, {
  timestamps: true
});

export default mongoose.model('Naissance', NaissanceSchema);
