import express from 'express';
import PerformanceController from 'src/controllers/v1/performance';
import { catchAsync } from 'src/utils';
import {
  categoriesSchema,
  getPerformanceScoreSchema,
  groupsSchema,
} from 'src/validations/requests';

const router = express.Router();

router.get(
  '/',
  catchAsync(async (req, res) => {
    const { classId, timezone, days, viewLOs, group, studentId } = req.query;
    const { error, value } = getPerformanceScoreSchema.validate(
      {
        classId,
        timezone,
        days,
        viewLOs,
        group,
        studentId,
      },
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

    const performancesController = new PerformanceController();
    const response = await performancesController.getPerformanceScores(
      value.classId,
      value.timezone,
      value.days,
      value.viewLOs,
      value.group,
      value.studentId
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

router.get(
  '/categories',
  catchAsync(async (req, res) => {
    const { error, value } = categoriesSchema.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: 'bad request',
        errors: error.details.map(
          (detail: { message: string }) => detail.message
        ),
      });
    }

    const performancesController = new PerformanceController();
    const response = await performancesController.getPerformanceCategories(
      value.classId,
      value.timezone,
      value.days
    );

    return res.status(200).json(response);
  })
);

router.get('/skills', async (_, res) => {
  const performancesController = new PerformanceController();
  const response = await performancesController.getSkillScores();

  return res.status(200).json(response);
});

export default router;
