import Joi from 'joi';

export const permissionSchema = Joi.object({
  id: Joi.string().required(),
});

export const groupsSchema = Joi.object({
  classId: Joi.string().guid().required(),
  timezone: Joi.number().min(-12).max(14).required(),
});
