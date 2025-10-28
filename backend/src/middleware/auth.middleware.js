import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: "Access token required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};