import express from 'express';
import createError from 'http-errors';
import PerformanceController from 'src/controllers/v1/performance';
import { catchAsync } from 'src/utils';
import { groupsSchema } from 'src/validations/requests';

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const timeZoneOffset = parseInt(
      req.query.timeZoneOffset?.toString() ?? '0'
    );

    if (isNaN(timeZoneOffset)) {
      throw createError(400, {
        message: `timeZoneOffset param is not a number`,
      });
    }

    const performancesController = new PerformanceController();
    const response = await performancesController.getPerformanceScores(
      timeZoneOffset
    );

    return res.status(200).json(response);
  })
);

router.get('/groups', async (req, res) => {
  const { classId, timezone } = req.query;
  const { error } = groupsSchema.validate(
    { classId, timezone },
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
    const performancesController = new PerformanceController();
    const response = await performancesController.getPerformanceGroups(
      classId as string,
      parseFloat(timezone as string),
      req
    );

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: `${err}` });
  }
});

router.get('/skills', async (_, res) => {
  const performancesController = new PerformanceController();
  const response = await performancesController.getSkillScores();

  return res.status(200).json(response);
});

export default router;
