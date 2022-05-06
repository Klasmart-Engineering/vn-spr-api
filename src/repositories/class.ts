import { ClassA, PrismaClient } from '@prisma/client';
import { UUID } from 'src/types';

export default class ClassRepository {
  prisma = new PrismaClient();

  async getClasses({ orgId }: { orgId?: UUID }): Promise<ClassA[]> {
    return await this.prisma.classA.findMany({
      where: {
        ...(orgId ? { orgId } : {}),
      },
    });
  }
}
