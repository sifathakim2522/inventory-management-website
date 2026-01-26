import express from 'express';
import { addSupplier, getSuppliers, updateSupplier, deleteSupplier } from '../controllers/SuppliersController.js';
import authMiddleware from '../middleware/authmiddleware.js'; // Ensure user is logged in

const router = express.Router();

router.post('/add', authMiddleware, addSupplier);
router.get('/', authMiddleware, getSuppliers);
router.put('/:id', authMiddleware, updateSupplier);
router.delete('/:id', authMiddleware, deleteSupplier);

export default router;

