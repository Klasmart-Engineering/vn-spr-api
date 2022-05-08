import express from 'express';
import createError from 'http-errors';
import PerformanceController from 'src/controllers/v1/performance';
import { catchAsync } from 'src/utils';
import { getPerformanceScoreSchema } from 'src/validations/requests';

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const { error, value } = getPerformanceScoreSchema.validate(req.query);
    if (error) {
      throw createError(400, { message: error });
    }

    const performancesController = new PerformanceController();
    const response = await performancesController.getPerformanceScores(
      value.classId,
      value.fromDay,
      value.toDay,
      value.timeZoneOffset
    );

    return res.status(200).json(response);
  })
);

router.get('/groups', async (_, res) => {
  const performancesController = new PerformanceController();
  const response = await performancesController.getPerformanceGroups();

  return res.status(200).json(response);
});

router.get('/skills', async (_, res) => {
  const performancesController = new PerformanceController();
  const response = await performancesController.getSkillScores();

  return res.status(200).json(response);
});

export default router;
