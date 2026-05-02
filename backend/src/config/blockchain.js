import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
export const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

export const contractABI = [
  "function enregistrerNaissance(string memory _idActe, string memory _hashDonnees, string memory _encryptedData, string memory _prefecture, string memory _agentId) public",
  "function verifierNaissance(string memory _idActe) public view returns (bool valide, string memory hashDonnees, string memory encryptedData, string memory prefecture, uint256 dateEnregistrement)",
  "function totalActes() public view returns (uint256)",
  "function tousLesActes(uint256) public view returns (string)"
];

export const naissanceContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  contractABI,
  wallet
);
