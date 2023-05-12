import Joi from 'joi';
import express from 'express';

/**
 * @param {Joi.Schema} schema
 * @param {string} redirectPath
 */
export const genValidator = (schema, redirectPath) => {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return (req, res, next) => {
    const result = schema.validate(req.body);

    if (result.error) {
      req.flash('error', result.error.details[0].message);

      return res.redirect(redirectPath);
    }

    next();
  };
};
