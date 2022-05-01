import express from 'express';
import createError from 'http-errors';
import PerformanceController from 'src/controllers/v1/performance';
import { catchAsync } from 'src/utils';

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
