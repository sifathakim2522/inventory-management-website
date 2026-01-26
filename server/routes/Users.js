import express from 'express';
import { addUser, getUsers, updateUser, deleteUser } from '../controllers/usercontroller.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addUser);
router.get('/', authMiddleware, getUsers);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
