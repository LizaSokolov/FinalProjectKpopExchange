const validate = (schema) => (req, res, next) => {
    const data = req.body;

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ error: errorMessages });
    }

    next();
};

export default validate;

