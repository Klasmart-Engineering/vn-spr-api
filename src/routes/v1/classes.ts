import express from 'express';
import createError from 'http-errors';
import ClassController from 'src/controllers/v1/class';
import { catchAsync } from 'src/utils';
import { getClassesSchema } from 'src/validations/requests';

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const classController = new ClassController();
    const { error, value } = getClassesSchema.validate(req.query);
    if (error) {
      throw createError(400, { message: error });
    }
    const response = await classController.getClasses(
      value.orgId,
      value.selectedDay,
      value.timeZoneOffset,
    );

    return res.status(200).json(response);
  })
);

export default router;
