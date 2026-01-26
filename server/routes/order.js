import express from 'express';
import { addOrder, getOrders, deleteOrder } from '../controllers/ordercontroller.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addOrder);
router.get('/', authMiddleware, getOrders);
router.delete('/:id', authMiddleware, deleteOrder);

export default router;
