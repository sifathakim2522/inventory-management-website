import User from "../models/user.js";
import bcrypt from 'bcrypt';

// Add User
const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        
        // 1. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            address,
            role: role || 'user' // Default to 'user' if empty
        });

        await newUser.save();
        
        return res.status(201).json({ success: true, message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get All Users
const getUsers = async (req, res) => {
    try {
        // .select('-password') means "Don't send the password back to the frontend"
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, address, role } = req.body;

        // Prepare update object
        let updateData = { name, email, address, role };

        // Only update password if a new one is provided (not empty)
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await User.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ success: true, message: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { addUser, getUsers, updateUser, deleteUser };
