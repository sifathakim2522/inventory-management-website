import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';

import authRoutes from './routes/auth.js';  
import categoryRoutes from './routes/Category.js';
import supplierRoutes from './routes/Supplier.js';
import productRoutes from './routes/Products.js'; // 1. <<< ADD THIS LINE
import userRoutes from './routes/Users.js';

import orderRoutes from './routes/order.js'; // 3. <<< ADD THIS LINE
import dashboardRoutes from './routes/dashboard.js'; // 5. <<< AND THIS LINE

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/products', productRoutes); // 2. <<< AND ADD THIS LINE
app.use('/api/users', userRoutes);
app.use('/api/order', orderRoutes); // 4. <<< AND THIS LIN
app.use('/api/dashboard', dashboardRoutes); // 6. <<< AND THIS LINE


const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
