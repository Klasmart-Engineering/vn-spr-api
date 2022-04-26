import express from 'express';

import PermissionsRouter from './permissions';
import PingRouter from './ping';

const router = express.Router();

router.use('/permissions', PermissionsRouter);
router.use('/ping', PingRouter);

export default router;
