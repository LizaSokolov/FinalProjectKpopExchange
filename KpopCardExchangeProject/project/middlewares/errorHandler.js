const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);

    if (err.name === "ValidationError") {
        return res.status(400).json({ error: "Bad Request", message: err.message });
    }

    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
    }

    if (err.name === "Forbidden") {
        return res.status(403).json({ error: "Forbidden", message: "Access denied" });
    }

    if (err.name === "NotFoundError") {
        return res.status(404).json({ error: "Not Found", message: "Resource not found" });
    }

    if (err.name === "ConflictError") {
        return res.status(409).json({ error: "Conflict", message: err.message });
    }

    res.status(500).json({ error: "Server Error", message: "Something went wrong" });
};

export default errorHandler;
