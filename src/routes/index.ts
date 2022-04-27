import express from 'express';

import PingRouter from './ping';
import V1Router from './v1';

const router = express.Router();

router.use('/v1', V1Router);
router.use('/ping', PingRouter);

export default router;
