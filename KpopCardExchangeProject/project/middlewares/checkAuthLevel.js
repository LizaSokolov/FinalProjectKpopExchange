const checkAuthLevel = (requiredLevel) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }

        if (req.user.isAdmin) {
            return next();
        }

        if (req.user.authLevel < requiredLevel) {
            return res.status(403).json({ error: "Access denied: insufficient permissions" });
        }

        next();
    };
};

export default checkAuthLevel;
