import express from 'express';
import { getProfile, updateProfile } from '../controllers/profilecontroller.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// NOTE: We don't need /:id here because authMiddleware knows who we are!

// GET /api/profile
router.get('/', authMiddleware, getProfile);

// PUT /api/profile
router.put('/', authMiddleware, updateProfile);

export default router;
