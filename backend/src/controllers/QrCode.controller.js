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

const getInventoryById = async (req, res) => {
    console.log("in");
    try {
        // Extract the ID from the request parameters
        const { id } = req.params;
        console.log(id);
        // Fetch the specific inventory item by ID and populate the qrIdentifier field
        const inventoryItem = await Inventory.findById(id).populate('qrIdentifier').exec();

        // Check if the item was found
        if (!inventoryItem) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // Format the response to include QR code image as a base64 string
        const formattedItem = {
            _id: inventoryItem._id,
            name: inventoryItem.name,
            partNumber: inventoryItem.partNumber,
            dateReceived: inventoryItem.dateReceived,
            dateDispatch: inventoryItem.dateDispatch,
            balanceItems: inventoryItem.balanceItems,
            qrCodeUrl: inventoryItem.qrIdentifier ? `data:image/png;base64,${inventoryItem.qrIdentifier.qrCodeImage.toString('base64')}` : null, // Convert buffer to base64 string
        };

        res.status(200).json({
            success: true,
            data: formattedItem,
            message: 'Inventory item fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory item',
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
    const { name, partNumber, dateReceived, dateDispatch, balanceItems } = req.body;

    try {
        // Fetch the specific inventory item by ID and populate the qrIdentifier field
        const inventoryItem = await Inventory.findById(id).populate('qrIdentifier').exec();

        // Check if the item was found
        if (!inventoryItem) {
            return res.status(404).json({
                success: false,
                message: 'Inventory item not found'
            });
        }

        // Update the inventory item fields
        inventoryItem.name = name;
        inventoryItem.partNumber = partNumber;
        inventoryItem.dateReceived = dateReceived;
        inventoryItem.dateDispatch = dateDispatch;
        inventoryItem.balanceItems = balanceItems;

        // Save the updated inventory item
        await inventoryItem.save();

        // Format the response to include QR code image as a base64 string
        const formattedItem = {
            _id: inventoryItem._id,
            name: inventoryItem.name,
            partNumber: inventoryItem.partNumber,
            dateReceived: inventoryItem.dateReceived,
            dateDispatch: inventoryItem.dateDispatch,
            balanceItems: inventoryItem.balanceItems,
            qrCodeUrl: inventoryItem.qrIdentifier ? `data:image/png;base64,${inventoryItem.qrIdentifier.qrCodeImage.toString('base64')}` : null, // Convert buffer to base64 string
        };
        res.status(200).json({
            success: true,
            data: formattedItem,
            message: 'Inventory item updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update inventory item',
            error: error.message
        });
    }
}

const deleteInventory = async (req, res) => {
    const { id } = req.params;
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
export { getAllInventory, getInventoryById, createInventory, updateInventory, deleteInventory };