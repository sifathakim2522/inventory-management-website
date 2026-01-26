import 'dotenv/config';
import mongoose from 'mongoose';

import bcrypt from 'bcrypt';
import User from './models/user.js'; // Ensure Capital U
import connectDB from './db/connection.js';

const createAdmin = async () => {
    try {
        await connectDB();

        // 1. Check if admin exists
        const email = "admin@gmail.com";
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("⚠️ Admin already exists. Updating password to 'admin'...");
            const hashedPassword = await bcrypt.hash("admin", 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin"; // Force role to admin
            await existingAdmin.save();
            console.log("✅ Admin updated successfully!");
        } else {
            console.log("✨ Creating new Admin...");
            const hashedPassword = await bcrypt.hash("admin", 10);
            
            const newAdmin = new User({
                name: "System Admin",
                email: email,
                password: hashedPassword,
                role: "admin",
                address: "Headquarters"
            });
            
            await newAdmin.save();
            console.log("✅ Admin created successfully!");
        }
        
        process.exit();
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

createAdmin();
