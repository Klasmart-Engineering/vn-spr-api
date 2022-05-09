import Joi from 'joi';

export const permissionSchema = Joi.object({
  id: Joi.string().required(),
});

export const groupsSchema = Joi.object({
  classId: Joi.string().guid().required(),
  timezone: Joi.number().min(-12).max(14).required(),
});

export const categoriesSchema = Joi.object({
  classId: Joi.string().guid().required(),
  timezone: Joi.number().min(-12).max(14).required(),
  days: Joi.number().valid(7, 30, 365).required(),
});
