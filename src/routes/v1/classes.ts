import express from 'express';
import ClassController from 'src/controllers/v1/class';

const router = express.Router();

router.get('/', async (_, res) => {
  const classController = new ClassController();
  const response = await classController.getClasses();

  return res.status(200).json(response);
});

export default router;
