import { Permission } from '../models';
import { AdminService } from '../services';

export const getPermission = async (
  name: string,
  token: string
): Promise<Permission | null> => {
  const adminService = await AdminService.getInstance(token);
  const permission = await adminService.getPermission(name);

  if (!permission) return null;
  return permission;
};
