import 'dotenv/config';
import bcrypt from 'bcrypt';
// Ensure this matches your actual filename casing exactly (e.g., User.js or user.js)
import User from './models/user.js'; 
import connectDB from './db/connection.js';

const registerUsers = async () => {
    try {
        await connectDB(); // Added await if connectDB is async (best practice)
        
        // Check if admin already exists to prevent duplicates
        const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "admin", // Removed trailing space
            email: "admin@gmail.com",
            password: hashedPassword,
            address: "admin address",
            role: "admin"
        });

        await newUser.save();
        console.log("Admin user created successfully");

    } catch (error) {
        console.log(error); // Fixed typo: .lor -> .log
    }
};

registerUsers(); // Fixed function call: register() -> registerUsers()
