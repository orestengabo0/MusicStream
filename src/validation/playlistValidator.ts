import Joi from "joi";

export const playlistValidator = {
    createPlaylist: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        description: Joi.string().max(500).optional(),
        songs: Joi.array().items(
            Joi.string().hex().length(24).messages({
                "string.length": "Each song ID must be a valid ObjectId (24 characters)."
            })
        ).optional(),
        owner: Joi.string().hex().length(24).required()
            .messages({ "string.length": "Owner ID must be a valid ObjectId (24 characters)." }),
        isPrivate: Joi.boolean().default(false)
    }),

    updatePlaylist: Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        description: Joi.string().max(500).optional(),
        songs: Joi.array().items(
            Joi.string().hex().length(24)
        ).optional(),
        owner: Joi.string().hex().length(24).optional(),
        isPrivate: Joi.boolean().optional()
    })
};
