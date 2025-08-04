import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().required().messages({
            "string.empty": "First name is required",
        }),
        middle: Joi.string().optional().allow("").messages({
            "string.base": "Middle name must be a string",
        }),
        last: Joi.string().required().messages({
            "string.empty": "Last name is required",
        }),
    }),
    isBusiness: Joi.boolean().optional(),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .allow("")
        .messages({
            "string.pattern.base": "Phone number must be 10 digits",
        }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters long.",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
        }),
    address: Joi.object({
        state: Joi.string().optional().allow(""),
        country: Joi.string().optional().allow(""),
        city: Joi.string().optional().allow(""),
        street: Joi.string().optional().allow(""),
        houseNumber: Joi.string().optional().allow(""),
        zip: Joi.string().optional().allow(""),
    }).optional(),
    avatar: Joi.string().uri().optional().allow(""),
    image: Joi.object({
        url: Joi.string().uri().optional().allow(""),
        alt: Joi.string().optional().allow(""),
    }).optional(),

    bio: Joi.string().optional().allow(""),
    favoriteGroups: Joi.array().items(Joi.string()).optional(),
    cards: Joi.array().items(Joi.string()).optional(),
});

export const updateUserSchema = createUserSchema.fork(
    Object.keys(createUserSchema.describe().keys),
    (schema) => schema.optional()
);
