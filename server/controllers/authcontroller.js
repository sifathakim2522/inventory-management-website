import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log(`🔑 Login Attempt for: ${email}`);

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // --- EMERGENCY BYPASS START ---
        // If the email is admin@gmail.com, we LET THEM IN automatically.
        // We skip the password check for now to get you back into your system.
        if (email === "admin@gmail.com") {
            console.log("🔓 ADMIN DETECTED: Bypassing password check for recovery.");
        } 
        // For everyone else, we check the password
        else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, error: "Wrong Password" });
            }
        }
        // --- EMERGENCY BYPASS END ---

        // 2. CHECK FOR JWT KEY (Common crash cause)
        if (!process.env.JWT_KEY) {
            console.error("💥 CRITICAL ERROR: JWT_KEY is missing in .env file!");
            return res.status(500).json({ success: false, error: "Server Configuration Error (JWT)" });
        }

        // 3. Create Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_KEY, 
            { expiresIn: "10d" }
        );

        console.log("✅ Login Successful. Sending token.");
        return res.status(200).json({ 
            success: true, 
            token, 
            user: { _id: user._id, name: user.name, role: user.role } 
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};

const verify = (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
}

export { login, verify };

