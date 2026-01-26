import express from 'express';
import { addProduct, getProducts, updateProduct, deleteProduct } from '../controllers/Productscontroller';
import authMiddleware from '../middleware/authmiddleware.js'; // Make sure file name matches folder

const router = express.Router();

router.post('/add', authMiddleware, addProduct);
router.get('/', authMiddleware, getProducts);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
export default router;
