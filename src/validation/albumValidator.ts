import Joi from "joi";

export const albumValidator = {
    createAlbum: Joi.object({
        name: Joi.string().required(),
        releaseDate: Joi.date().max("now").required(),
        coverImage: Joi.string()
    }),
    removeSongFromAlbum: Joi.object({
        songId: Joi.string().required(),
        albumId: Joi.string().required()
    }),
    addSongToAlbum: Joi.object({
        songId: Joi.string().required(),
        albumId: Joi.string().required()
    })
}