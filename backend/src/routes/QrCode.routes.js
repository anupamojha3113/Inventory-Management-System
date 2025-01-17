import { Router } from 'express'
const router = Router();

import {
    getAllInventory,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory
} from '../controllers/QrCode.controller.js';

router.route('/getAllInventory').get(getAllInventory);
router.route('/getInventoryById/:id').get(getInventoryById);
router.route('/createInventory').post(createInventory);
router.route('/updateInventory/:id').put(updateInventory);
router.route('/deleteInventory/:id').delete(deleteInventory);

export default router;