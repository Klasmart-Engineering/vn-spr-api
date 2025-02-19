import express from 'express';

import PingController from '../controllers/ping';

const router = express.Router();

router.get('/', async (_, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

export default router;
