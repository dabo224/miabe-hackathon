# Miabe Hackathon : Digitalisation de l'État Civil (Guinée)

## 🌟 Vision du Projet

Ce projet vise à révolutionner la gestion de l'état civil en Guinée, en commençant par la digitalisation complète de l'enregistrement des naissances. L'objectif est de garantir l'**immutabilité**, la **transparence** et l'**accessibilité** des actes de naissance grâce à une architecture moderne combinant applications mobiles, backend robuste et technologie Blockchain.

---

## 🏗️ Architecture du Système

Le projet est divisé en quatre composantes majeures qui communiquent de manière fluide pour assurer l'intégrité des données :

1.  **Backend (Cœur de Confiance)** : Serveur central gérant la logique métier, la persistance des données et l'ancrage sur la Blockchain.
2.  **Agent Terrain (App Mobile)** : Outil dédié aux agents de santé et officiers d'état civil pour enregistrer les naissances directement sur le lieu de naissance.
3.  **Écran Famille (App Mobile)** : Interface citoyenne permettant aux familles de suivre leurs dossiers, déclarer une naissance et consulter leurs certificats numériques.
4.  **Site Vitrine** : Plateforme de présentation et d'information sur la solution pour le grand public et les autorités.

---

## 📦 Composants en Détail

### ⚙️ Backend (`/backend`)
Le moteur du système. Il assure la sécurité et la validité de chaque enregistrement.
- **API REST** : Développée en Node.js avec Express.
- **Base de Données** : MongoDB (via Mongoose) pour un stockage flexible et performant.
- **Blockchain (Ethereum/EVM)** : Utilisation de Hardhat pour le déploiement de smart contracts. Chaque acte validé génère un hash unique stocké sur la blockchain, garantissant qu'aucune modification ultérieure n'est possible sans laisser de trace.
- **Sécurité** : Hashage des données sensibles et authentification sécurisée.

### 📱 Agent Terrain (`/agent-terrain`)
Application mobile conçue pour une utilisation intensive sur le terrain.
- **Framework** : React Native avec Expo.
- **Navigation** : Expo Router pour une structure fluide.
- **Fonctionnalités** :
    - Enregistrement complet (Enfant, Parents, Déclarant).
    - Mode hors-ligne (synchronisation ultérieure).
    - Génération de PDF et QR Code pour les certificats provisoires.

### 👨‍👩‍👧‍👦 Écran Famille (`/ecran-famille`)
Application mobile centrée sur l'expérience utilisateur citoyenne.
- **Framework** : React Native avec Expo.
- **Fonctionnalités** :
    - Suivi du statut des déclarations (En attente, Approuvé, Rejeté).
    - Scanner de QR Code pour vérification d'authenticité.
    - Accès sécurisé au profil familial.

### 🌐 Site Vitrine (`/site-vitrine`)
- **Technologie** : React + TypeScript + Vite.
- **Objectif** : Communication institutionnelle et démonstration des avantages de la solution.

---

## 🛠️ Stack Technologique

| Domaine | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Mobile** | React Native, Expo, TypeScript, Expo Router |
| **Frontend Web** | React, Vite, Tailwind CSS |
| **Blockchain** | Solidity, Hardhat, Ethers.js |
| **Outils** | PDF generation, QR Code logic |

---

## 🚀 Fonctionnalités Phares

- **Authenticité Garantie** : Chaque acte de naissance possède un `hashDonnees` ancré dans la Blockchain.
- **QR Code Dynamique** : Permet à n'importe quelle autorité de vérifier instantanément la validité d'un document physique via l'application.
- **Workflow de Validation** : Un système de statut (`PENDING`, `APPROVED`, `REJECTED`) permet un contrôle administratif rigoureux.
- **Localisation Précise** : Gestion fine des localisations (Régions, Préfectures, Sous-préfectures, Quartiers) adaptée à l'administration guinéenne.

---

## 📥 Installation et Lancement

### Prérequis
- Node.js (v18+)
- MongoDB (local ou Atlas)
- Expo Go (pour les tests mobiles)

### 1. Backend
```bash
cd backend
npm install
# Configurez votre .env (MONGO_URI, etc.)
npm start
```

### 2. Applications Mobiles (Agent & Famille)
```bash
cd agent-terrain # ou ecran-famille
npm install
npx expo start
```

### 3. Site Vitrine
```bash
cd site-vitrine
npm install
npm run dev
```

---

## 📄 Structure du Modèle de Données (Extrait)
Chaque naissance enregistrée comporte :
- **Enfant** : Prénoms, Nom, Sexe, Date/Heure, Lieu (Région/Préfecture/Sous-Préfecture).
- **Parents** : Identité, Nationalité, Profession.
- **Métadonnées** : `agentId`, `hashDonnees`, `txHash` (Blockchain), `qrCode`.

---

© 2026 Miabe Hackathon - Digitalisation pour un futur transparent.
