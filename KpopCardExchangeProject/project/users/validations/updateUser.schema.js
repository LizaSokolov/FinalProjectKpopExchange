import Joi from "joi";

export const updateUserSchema = Joi.object({
    name: Joi.object({
        first: Joi.string().min(2).optional(),
        middle: Joi.string().allow("").optional(),
        last: Joi.string().min(2).optional(),
    }).optional(),
    phone: Joi.string().pattern(/^\d+$/).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$"))
        .optional(),
    address: Joi.object({
        state: Joi.string().optional(),
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        street: Joi.string().optional(),
        houseNumber: Joi.string().optional(),
    }).optional(),
    image: Joi.object({
        url: Joi.string().uri().optional(),
        alt: Joi.string().optional(),
    }).optional(),
    isBusiness: Joi.boolean().optional(),
});
