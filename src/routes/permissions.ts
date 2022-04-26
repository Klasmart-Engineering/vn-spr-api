import express from 'express';
import createError from 'http-errors';

import PermissionController from '../controllers/permission';

const router = express.Router();

router.get('/:name', async (req, res) => {
  const permissionName = req.params.name as string;
  if (!permissionName) {
    throw createError(400, { message: `permissionName param is required` });
  }

  const controller = new PermissionController();
  try {
    const response = await controller.getPermission(permissionName, req);
    return res.send(response);
  } catch (error) {
    const e = JSON.parse(error as string);
    const statusCode = e.statusCode ?? 500;
    const errorMessage = e.result.errors[0].message;
    return res.status(statusCode).json({ message: errorMessage });
  }
});

export default router;
