import Joi from "joi";

export const userValidator = {
  createUser: Joi.object({
    username: Joi.string().min(3).max(30).required(),
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
    profileImage: Joi.string().uri().optional(),
    likedSongs: Joi.array().items(Joi.string().hex().length(24)).optional(),
    playlists: Joi.array().items(Joi.string().hex().length(24)).optional(),
  }),

  loginUser: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),

  updateUser: Joi.object({
    username: Joi.string().min(3).max(30).optional(),
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
    profileImage: Joi.string().uri().optional(),
    likedSongs: Joi.array().items(Joi.string().hex().length(24)).optional(),
    playlists: Joi.array().items(Joi.string().hex().length(24)).optional(),
  }),
};
