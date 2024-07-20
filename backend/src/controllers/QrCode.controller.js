import { Inventory } from '../models/inventory.model.js';
import { QRCodeSchema } from '../models/QrCode.model.js';
import QRCode from 'qrcode'
import { generateQRCode, saveQRCodeToDB, updateQRCodeInDB, deleteQRCodeFromDB } from '../utils/qrCodeUtils.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const getAllInventory = async (req, res) => {
    try {
        // Fetch all inventory items and populate the qrIdentifier field to get QR code details
        const inventories = await Inventory.find().populate('qrIdentifier').exec();

        // Map through the inventory items to format the data
        const inventoryWithQRImage = inventories.map(item => ({
            _id: item._id,
            name: item.name,
            dateReceived: item.dateReceived,
            dateDispatched: item.dateDispatch,
            balanceItems: item.balanceItems,
            qrCodeUrl: item.qrIdentifier ? `data:image/png;base64,${item.qrIdentifier.qrCodeImage.toString('base64')}` : null, // Convert buffer to base64 string
            // Add other fields as necessary
        }));

        res.status(200).json({
            success: true,
            data: inventoryWithQRImage,
            message: 'Inventory fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory',
            error: error.message
        });
    }
};

const createInventory = async (req, res) => {
    const { name, dateReceived, balanceItems } = req.body;

    if (!name || !dateReceived || !balanceItems) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Generate QR Code
        const qrCodeBuffer = await QRCode.toBuffer(name); // Generate QR Code with name
        const qrCodeBase64 = qrCodeBuffer.toString('base64'); // Convert buffer to Base64 string

        // Create QR Code Document
        const qrCodeDoc = new QRCodeSchema({ qrCodeImage: qrCodeBuffer });
        await qrCodeDoc.save();

        // Create Inventory Document
        const inventory = new Inventory({
            name,
            dateReceived,
            balanceItems,
            qrIdentifier: qrCodeDoc._id // Reference the QR Code document
        });

        const createdInventory = await inventory.save();

        // Prepare response data
        const response = {
            createdInventory,
            qrCodeImage: `data:image/png;base64,${qrCodeBase64}` // Include data URL scheme
        };
        console.log(new ApiResponse(201, response, "Inventory Created successfully"));
        res.status(201).json({
            success: true,
            message: 'Inventory created successfully',
            data: response
        });
    } catch (error) {
        console.error('Error creating inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { title, completed, qrCode } = req.body;

    try {
        let updatedinventory;

        // Check if qrCode is provided in the request body
        if (qrCode) {
            // Generate a new QR code
            const qrCodeData = JSON.stringify({ title, completed });
            const qrCodeBuffer = await generateQRCode(qrCodeData);

            // Save the new QR code in QRCode schema
            const newQRCodeId = await saveQRCodeToDB(qrCodeBuffer);

            // Find the existing QR code associated with the inventory item
            const existingQRCodeId = (await Inventory.findById(id)).qrCode;

            // If there's an existing QR code associated with the inventory item, delete it
            if (existingQRCodeId) {
                await deleteQRCodeFromDB(existingQRCodeId);
            }

            // Update the inventory item with the new QR code ID
            updatedinventory = await Inventory.findByIdAndUpdate(id, { title, completed, qrCode: newQRCodeId }, { new: true });

            // Include the updated QR code image in the response
            updatedinventory.QRCodeSchemaImage = qrCodeBuffer;
        } else {
            // If qrCode is not provided, only update the title and completed fields
            updatedinventory = await Inventory.findByIdAndUpdate(id, { title, completed }, { new: true });

            // Regenerate QR code if title is modified
            const qrCodeData = JSON.stringify({ title: updatedinventory.title, completed });
            const qrCodeBuffer = await generateQRCode(qrCodeData);

            // Update the QR code associated with the inventory item
            await updateQRCodeInDB(updatedinventory.QRCodeSchema, qrCodeBuffer);

            // Include the updated QR code image in the response
            updatedinventory.QRCodeSchemaImage = qrCodeBuffer;
        }

        // Check if the inventory item exists
        if (!updatedinventory) {
            return new ApiError(500, 'Failed to find inventory');
        }

        // Construct the response object with QR code image included
        const response = {
            _id: updatedinventory._id,
            title: updatedinventory.title,
            completed: updatedinventory.completed,
            qrCodeImage: updatedinventory.QRCodeSchemaImage
        };

        res.json(response);
    } catch (error) {
        console.error('Error updating inventory:', error);
        return new ApiError(500, 'Failed to update inventory');
    }
}
const deleteInventory = async (req, res) => {
    const { id } = req.params;
    console.log("in");
    try {
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return new ApiError(400, 'inventory not found');
        }

        // Delete the associated QR code if it exists
        if (inventory.QRCodeSchema) {
            await deleteQRCodeFromDB(inventory.QRCodeSchema);
        }

        // Delete the inventory item
        const deletedinventory = await Inventory.findByIdAndDelete(id);
        if (!deletedinventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }
        return new ApiResponse(200, 'Inventory deleted successfully');
    } catch (error) {
        console.error('Error deleting inventory:', error);
        return new ApiError(500, 'Failed to delete inventory');
    }
}
export { getAllInventory, createInventory, updateInventory, deleteInventory };