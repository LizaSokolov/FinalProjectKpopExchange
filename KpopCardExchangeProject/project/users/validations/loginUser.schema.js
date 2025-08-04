import Joi from "joi";

const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Please enter a valid email address.",
    }),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$"))
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters long.",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
        }),
});

export const validateLoginUser = (req, res, next) => {

    const { error } = loginUserSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            errors: error.details.map((err) => err.message),
        });
    }

    next();
};
