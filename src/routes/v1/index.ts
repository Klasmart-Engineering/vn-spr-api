import express from 'express';

import PermissionsRouter from './permissions';

const router = express.Router();

router.use('/permissions', PermissionsRouter);

export default router;
