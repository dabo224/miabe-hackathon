import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("Démarrage du déploiement du contrat NaissanceChain...");

  // Récupérer le contrat à déployer
  const NaissanceChain = await ethers.getContractFactory("NaissanceChain");

  // Déployer le contrat
  const contract = await NaissanceChain.deploy();

  // Attendre que le déploiement soit terminé (version Ethers v6)
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("-----------------------------------------");
  console.log("✅ Déploiement réussi !");
  console.log(`📍 Adresse du contrat : ${address}`);
  console.log("-----------------------------------------");
  console.log("Copiez cette adresse dans votre fichier .env");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
