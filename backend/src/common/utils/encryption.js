import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config();

const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY || 'default_secret_key_change_me';

/**
 * Encrypts a JSON object into a string for blockchain storage.
 * @param {Object} data - The data to encrypt.
 * @returns {string} - The encrypted string.
 */
export const encryptRecord = (data) => {
    try {
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), MASTER_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt record data');
    }
};

/**
 * Decrypts a ciphertext string back into a JSON object.
 * @param {string} ciphertext - The encrypted string from the blockchain.
 * @returns {Object} - The original data object.
 */
export const decryptRecord = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, MASTER_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt record data. Key might be wrong.');
    }
};
