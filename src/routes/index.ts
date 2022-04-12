import express from 'express';

import PingRouter from './ping';

const router = express.Router();

router.use('/', PingRouter);

export default router;
