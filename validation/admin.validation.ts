import Joi from 'joi';

export const adminLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  otp: Joi.number().optional(),
  secret: Joi.object({
    qr: Joi.string().optional(),
    secret: Joi.string().optional(),
    uri: Joi.string().optional(),
  }),
});
export const UpdateProfileValidator = Joi.object({
  name: Joi.string().required(),
});
