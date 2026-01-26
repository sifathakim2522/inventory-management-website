import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if (!token || token === 'null' || token === 'undefined') {
            console.warn('AuthMiddleware: No token provided');
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        let decoded;
        try {
            decoded  = jwt.verify(token, process.env.JWT_KEY);

        } catch (err) {
            console.warn('AuthMiddleware: Token invalid or expired', err.message);
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            console.warn('AuthMiddleware: No user found for id in token', decoded.id);
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) { 
        console.error("Error in auth middleware:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error in middleware" });
    }
}; // FIXED: Added closing semicolon

export default authMiddleware;
