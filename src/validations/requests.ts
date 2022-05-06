import DateExtension from '@joi/date';
import * as JoiImport from 'joi';
const Joi = JoiImport.extend(DateExtension);

export const permissionSchema = Joi.object({
  id: Joi.string().required(),
});

export const getClassesSchema = Joi.object({
  orgId: Joi.string().required(),
  date: Joi.date().format('YYYY-MM-DD'),
  timeZoneOffset: Joi.number().integer(),
});
