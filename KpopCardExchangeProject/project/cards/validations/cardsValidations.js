import Joi from "joi";

export const createCardSchema = Joi.object({
    idol: Joi.string().required(),
    group: Joi.string().required(),
    album: Joi.string().required(),
    imageUrl: Joi.string().uri().required(),
});

export const updateCardSchema = Joi.object({
    idol: Joi.string().optional(),
    group: Joi.string().optional(),
    album: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional(),
});
