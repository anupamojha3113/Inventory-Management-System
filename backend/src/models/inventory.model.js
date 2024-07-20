import mongoose from 'mongoose';


const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    partNumber: { type: String },
    dateReceived: { type: Date, required: true },
    dateDispatch: { type: Date },
    balanceItems: { type: Number, required: true },
    qrIdentifier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QRCodeSchema'
    }
}, { timestamps: true });

export const Inventory = mongoose.model('Inventory', inventorySchema);
