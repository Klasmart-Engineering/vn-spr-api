import { User } from '../models';
import { AdminService } from '../services';

export const getUsersByIds = async (
  studentIds: string[],
  token: string
): Promise<User[] | null> => {
  const adminService = await AdminService.getInstance(token);
  const users = await adminService.getUsersByIds(studentIds);

  if (!users) return null;
  return users;
};
