import express from 'express';
import { getDashboardStats } from '../controllers/dashboardcontroller.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, getDashboardStats);

export default router;
