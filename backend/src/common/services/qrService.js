import QRCode from 'qrcode';

/**
 * Generates a QR code for a given birth record ID.
 * @param {string} idActe - The unique birth certificate ID.
 * @returns {Promise<string>} - Base64 encoded QR code image.
 */
export const generateQRCode = async (idActe) => {
  const baseUrl = process.env.VERIFICATION_BASE_URL || 'https://naissancechain.gn/verify';
  const url = `${baseUrl}/${idActe}`;
  
  try {
    const qrCodeBase64 = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H', // High error correction
      width: 400,
      margin: 2,
      color: {
        dark: '#009A60',  // Guinean Green
        light: '#FFFFFF'
      }
    });
    
    return qrCodeBase64;
  } catch (err) {
    console.error('Error generating QR Code:', err);
    throw new Error('QR Code generation failed');
  }
};
