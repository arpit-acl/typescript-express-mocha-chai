import Joi from 'joi';

export const verfiyOtpValidation = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().allow('').optional()
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signupValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confimPassword: Joi.string().required().equal('password'),
  dob: Joi.string().required(),
});
