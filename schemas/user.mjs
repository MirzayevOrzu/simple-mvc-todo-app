import Joi from 'joi';

export const userLoginSchema = Joi.object({
  username: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
});

export const userRegisterSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
});
