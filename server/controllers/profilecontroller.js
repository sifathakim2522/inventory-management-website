import User from "../models/user.js"; // Lowercase 'u'
import bcrypt from 'bcrypt';

// Get MY Profile
const getProfile = async (req, res) => {
    try {
        // We get the ID from req.user (set by authMiddleware)
        // We don't need to pass ID in the URL params
        const userId = req.user._id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
             return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update MY Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, address, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update basic fields
        user.name = name || user.name;
        // user.email = email; // Usually we don't let users change email easily
        user.address = address || user.address;

        // Safe Password Update
        if (password && password.length > 0) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Profile Update Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getProfile, updateProfile };
