import Joi from "joi";

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

export const registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required().messages({
      "any.required": "First name is required",
    }),
    last_name: Joi.string().required().messages({
      "any.required": "Last name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Phone number is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
    dob: Joi.date().required().messages({
      "any.required": "Date of birth is required",
    }),
    gender: Joi.string().valid("male", "female", "other").required(),
  });
  return schema.validate(data, { abortEarly: false });
};

export const updateUserValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required().messages({
      "any.required": "First name is required",
    }),
    last_name: Joi.string().required().messages({
      "any.required": "Last name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Phone number is required",
    }),
    dob: Joi.date().required().messages({
      "any.required": "Date of birth is required",
    }),
    gender: Joi.string().valid("male", "female", "other"),
  });
  return schema.validate(data, { abortEarly: false });
};
