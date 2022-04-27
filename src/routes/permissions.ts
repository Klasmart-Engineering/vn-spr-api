import { ApolloError } from '@apollo/client/errors';
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
    let errorResponse: ApolloError | { message: string };
    if (error instanceof ApolloError) {
      errorResponse = error;
    } else if (error instanceof Error) {
      errorResponse = { message: error.message };
    } else {
      errorResponse = { message: error as string };
    }
    return res.status(500).send(errorResponse);
  }
});

export default router;
