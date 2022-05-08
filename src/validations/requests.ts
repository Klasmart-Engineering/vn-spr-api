import DateExtension from '@joi/date';
import * as JoiImport from 'joi';
const Joi = JoiImport.extend(DateExtension);

export const permissionSchema = Joi.object({
  id: Joi.string().required(),
});

export const getClassesSchema = Joi.object({
  orgId: Joi.string().required(),
  selectedDay: Joi.date().format('YYYY-MM-DD'),
  timeZoneOffset: Joi.number().integer().min(-39600).max(43200)
});

export const getPerformanceScoreSchema = Joi.object({
  classId: Joi.string().required(),
  fromDay: Joi.date().format('YYYY-MM-DD'),
  toDay: Joi.date().format('YYYY-MM-DD'),
  timeZoneOffset: Joi.number().integer().min(-39600).max(43200)
});
