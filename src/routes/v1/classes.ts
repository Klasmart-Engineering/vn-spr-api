import express from 'express';
import ClassController from 'src/controllers/v1/class';
import { catchAsync } from 'src/utils';
import { getClassesSchema } from 'src/validations/requests';

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const { orgId, isTeacher, selectedDay, timezone } = req.query;
    const { error, value } = getClassesSchema.validate(
      { orgId, isTeacher, selectedDay, timezone },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        message: 'bad request',
        errors: error.details.map(
          (detail: { message: string }) => detail.message
        ),
      });
    }

    try {
      const classController = new ClassController();
      const response = await classController.getPerformanceClasses(
        req,
        value.orgId,
        value.isTeacher,
        value.selectedDay,
        value.timezone
      );

      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ message: `${err}` });
    }
  })
);

export default router;
