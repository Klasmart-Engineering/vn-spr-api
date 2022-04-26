import Joi from 'joi';

export const permissionSchema = Joi.object({
  id: Joi.string().required(),
});
