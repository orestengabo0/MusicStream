import Joi from "joi";

export const songValidator = {
    createSong: Joi.object({
        title: Joi.string().min(2).max(100).required(),
        genre: Joi.string().min(2).max(50).required(),
        album: Joi.string().min(2).max(100).required(),
        releaseDate: Joi.date().max("now").required()
            .messages({ "date.max": "Release date cannot be in the future." }),
        coverImage: Joi.string().uri().required()
            .messages({ "string.uri": "Cover image must be a valid URL." }),
        featuredArtists: Joi.array().items(Joi.string().min(2).max(50)).optional(),
    }),

    updateSong: Joi.object({
        title: Joi.string().min(2).max(100).optional(),
        artist: Joi.string().hex().length(24).optional(),
        genre: Joi.string().min(2).max(50).optional(),
        album: Joi.string().min(2).max(100).optional(),
        releaseDate: Joi.date().max("now").optional(),
        duration: Joi.number().positive().optional(),
        audioUrl: Joi.string().uri().optional(),
        coverImage: Joi.string().uri().optional(),
        likes: Joi.number().min(0).optional(),
        featuredArtists: Joi.array().items(Joi.string().min(2).max(50)).optional(),
        playCount: Joi.number().min(0).optional()
    })
};
