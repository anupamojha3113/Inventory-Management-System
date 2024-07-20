import mongoose from 'mongoose';


const qrCodeSchema = new mongoose.Schema({
    qrCodeImage: Buffer
});

export const QRCodeSchema = mongoose.model('QRCodeSchema', qrCodeSchema);

