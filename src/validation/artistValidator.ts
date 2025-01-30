import Joi from "joi";

export const artistValidator = {
  createArtist: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 uppercase letter, 1 number, and 1 special character.",
      }),
    bio: Joi.string().max(500).optional(),
    artistProfileImage: Joi.string().uri().optional(),
    genres: Joi.array()
      .items(Joi.string().min(2))
      .min(1)
      .required()
      .messages({ "array.min": "An artist must have at least one genre." }),
    followers: Joi.array().items(Joi.string().hex().length(24)).optional(),
    songs: Joi.array().items(Joi.string().hex().length(24)).optional(),
  }),

  updateArtist: Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string()
      .min(6)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$"
        )
      )
      .optional()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 uppercase letter, 1 number, and 1 special character.",
      }),
    bio: Joi.string().max(500).optional(),
    artistProfileImage: Joi.string().uri().optional(),
    genres: Joi.array()
      .items(Joi.string().min(2))
      .min(1)
      .optional()
      .messages({ "array.min": "An artist must have at least one genre." }),
    followers: Joi.array().items(Joi.string().hex().length(24)).optional(),
    songs: Joi.array().items(Joi.string().hex().length(24)).optional(),
  }),
};
