import Joi from "joi";

export const musicValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required",
    }),
    album_name: Joi.string().required().messages({
      "any.required": "Album name is required",
    }),
    artist_id: Joi.number().required().messages({
      "any.required": "Artist ID is required",
    }),
    genre: Joi.string().required().messages({
      "any.required": "Genre is required",
    }),
    released_date: Joi.date().required().messages({
      "any.required": "Released date is required",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};
