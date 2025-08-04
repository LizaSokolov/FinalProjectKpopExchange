import jwt from "jsonwebtoken";

export const generateToken = (user) => {

    if (!user || !user._id) {
        throw new Error("Invalid user object");
    }

    const payload = {
        userId: user._id,
        authLevel: user.authLevel || 1,
        isAdmin: user.isAdmin || false
    };

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    return token;
};

export const verifyToken = (token) => {

    if (!process.env.JWT_SECRET) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

export const checkAdminRights = (user) => {
    if (!user || !user.isAdmin) {
        throw new Error("Access denied. Admin rights required.");
    }
};
