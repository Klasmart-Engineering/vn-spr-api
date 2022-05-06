import { PrismaClient } from '@prisma/client';
import { UUID } from 'src/types';

export interface StudentPerfromanceScore {
  classId: UUID;
  studentId: UUID;
  achievedScore: number;
  totalScore: number;
  performanceScore: number;
}

export default class PerformanceScoreRepository {
  prisma = new PrismaClient();

  public async getPerformanceScoreOfStudentsByDate({
    orgId,
    scheduleId,
    classId,
    date,
  }: {
    orgId?: UUID;
    scheduleId?: UUID;
    classId?: UUID;
    date: Date;
  }): Promise<Array<StudentPerfromanceScore>> {
    const beginTimestamp = (date.setHours(0, 0, 0, 0) / 1000) | 0;
    const endTimestamp = (date.setHours(23, 59, 59, 59) / 1000) | 0;

    const performanceScores = await this.prisma.performanceScoreA.groupBy({
      by: ['studentId', 'classId'],
      _sum: {
        achievedScore: true,
        totalScore: true,
      },
      where: {
        ...(orgId ? { orgId } : {}),
        ...(scheduleId ? { scheduleId } : {}),
        ...(classId ? { classId } : {}),
        OR: [
          {
            startAt: {
              gte: beginTimestamp,
              lte: endTimestamp,
            },
          },
          {
            dueAt: {
              gte: beginTimestamp,
              lte: endTimestamp,
            },
          },
        ],
      },
    });

    const studentPerformanceScores: Array<StudentPerfromanceScore> = [];
    for (let i = 0; i < performanceScores.length; i++) {
      const performanceScore = performanceScores[i];
      if (
        !performanceScore._sum.achievedScore ||
        !performanceScore._sum.totalScore
      )
        continue;
      const studentPerformanceScore =
        (performanceScore._sum.achievedScore * 100) /
        performanceScore._sum.totalScore;
      studentPerformanceScores.push({
        classId: performanceScore.classId,
        studentId: performanceScore.studentId,
        achievedScore: performanceScore._sum.achievedScore,
        totalScore: performanceScore._sum.totalScore,
        performanceScore: studentPerformanceScore,
      });
    }
    return studentPerformanceScores;
  }
}
