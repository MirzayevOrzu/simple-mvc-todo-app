import Joi from 'joi';

export const todoCreateSchema = Joi.object({
  text: Joi.string().min(1).required(),
});

export const todoShareSchema = Joi.object({
  todoId: Joi.string().length(36).required(),
  userId: Joi.string().length(36).required(),
});
