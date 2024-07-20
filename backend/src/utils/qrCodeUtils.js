import qrCode from 'qrcode';
import {QRCodeSchema} from '../models/QrCode.model.js';

async function generateQRCode(data) {
    try {
        return await qrCode.toBuffer(data); // Returns a Buffer containing QR code image
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}

async function saveQRCodeToDB(qrCodeBuffer) {
    try {
        const qrCode = new QRCodeSchema({
            qrCodeImage: qrCodeBuffer
        });
        await qrCode.save();
        return qrCode._id; // Return the ID of the saved QR code
    } catch (error) {
        console.error('Error saving QR code to database:', error);
        throw new Error('Failed to save QR code to database');
    }
}

async function updateQRCodeInDB(id, qrCodeBuffer) {
    try {
        await QRCodeSchema.findByIdAndUpdate(id, { qrCodeImage: qrCodeBuffer });
    } catch (error) {
        console.error('Error updating QR code in database:', error);
        throw new Error('Failed to update QR code in database');
    }
}

async function deleteQRCodeFromDB(id) {
    try {
        await QRCodeSchema.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error deleting QR code from database:', error);
        throw new Error('Failed to delete QR code from database');
    }
}

export {
    generateQRCode,
    saveQRCodeToDB,
    updateQRCodeInDB,
    deleteQRCodeFromDB
};