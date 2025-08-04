import Joi from "joi";

export const validateMessage = (data) => {
    const schema = Joi.object({
        recipient: Joi.string().length(24).required().messages({
            "any.required": "Recipient is required",
            "string.length": "Invalid recipient ID",
        }),
        content: Joi.string().min(1).max(1000).required().messages({
            "any.required": "Message content is required",
            "string.empty": "Message cannot be empty",
            "string.max": "Message is too long",
        }),
    });

    return schema.validate(data);
};
