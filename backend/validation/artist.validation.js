import Joi from "joi";

export const artistValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name is required",
    }),
    dob: Joi.date().required().messages({
      "any.required": "Date of birth is required",
    }),
    gender: Joi.string().valid("male", "female", "other"),
    first_release_year: Joi.date().required().messages({
      "any.required": "First release year is required",
    }),
    address: Joi.string().required().messages({
      "any.required": "Address is required",
    }),
    no_of_albums_released: Joi.number().required().messages({
      "any.required": "Number of albums released is required",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};
