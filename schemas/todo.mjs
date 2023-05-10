import Joi from 'joi';

export const todoCreateSchema = Joi.object({
  text: Joi.string().min(1).required(),
});
