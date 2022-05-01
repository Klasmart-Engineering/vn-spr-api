import express from 'express';

import ClassesRouter from './classes';
import PerformancesRouter from './performances';
import PermissionsRouter from './permissions';

const router = express.Router();

router.use('/permissions', PermissionsRouter);
router.use('/classes', ClassesRouter);
router.use('/performances', PerformancesRouter);

export default router;
