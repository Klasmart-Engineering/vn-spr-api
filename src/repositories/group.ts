import { PrismaClient } from '@prisma/client';
import { GROUP_UPPER_THRESHOLD, SPS_INTERVAL_IN_DAYS } from 'src/config';
import { Group } from 'src/models';
import { getUsersByIds } from 'src/repositories';
import { ReportEntity } from 'src/types';
import { getVerInUse } from 'src/utils/database';

const prisma = new PrismaClient();

interface PerformanceGroups {
  above: Group;
  meets: Group;
  below: Group;
}

export const getGroups = async (
  classId: string,
  timezone: number,
  token: string
): Promise<PerformanceGroups> => {
  const groups: PerformanceGroups = {
    above: { total: 0, students: [] },
    meets: { total: 0, students: [] },
    below: { total: 0, students: [] },
  };

  const studentsScoreByDay = await getStudentsScoreByDay(classId, timezone);
  if (!Array.isArray(studentsScoreByDay)) {
    throw new Error(`Failed to get students score.`);
  }
  if (!studentsScoreByDay.length) {
    // doesn't have any data in DB
    return groups;
  }

  const studentIdsWithScoreAndDaysCount: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>
  > = {};
  studentsScoreByDay.forEach((s) => {
    if (!studentIdsWithScoreAndDaysCount[s.student_id]) {
      studentIdsWithScoreAndDaysCount[s.student_id] = {
        days: 1,
        totalScore: s.score,
      };
    } else {
      studentIdsWithScoreAndDaysCount[s.student_id].days += 1;
      studentIdsWithScoreAndDaysCount[s.student_id].totalScore += s.score;
    }
  });
  const studentIds = Object.keys(studentIdsWithScoreAndDaysCount);

  // Get users name from Admin Service
  const users = await getUsersByIds(studentIds, token);
  if (!users) {
    throw new Error(`Failed to get students information.`);
  }

  // Convert to [{id: {name, avatar}}]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const usersInfoWithKeys: Record<string, any> = users.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.id]: {
          name: `${item.givenName} ${item.familyName}`,
          avatar: item.avatar,
        },
      }),
    {}
  );

  studentIds.forEach((studentId) => {
    const { totalScore, days } = studentIdsWithScoreAndDaysCount[studentId];
    const sps = totalScore / days; // weekly average student performance score
    if (sps >= GROUP_UPPER_THRESHOLD) {
      groups.above.total += 1;
      groups.above.students.push({
        student_id: studentId,
        student_name: usersInfoWithKeys[studentId]?.name || 'Unknown User',
        avatar: usersInfoWithKeys[studentId]?.avatar || null,
      });
    } else if (sps < GROUP_UPPER_THRESHOLD) {
      groups.below.total += 1;
      groups.below.students.push({
        student_id: studentId,
        student_name: usersInfoWithKeys[studentId]?.name || 'Unknown User',
        avatar: usersInfoWithKeys[studentId]?.avatar || null,
      });
    } else {
      groups.meets.total += 1;
      groups.meets.students.push({
        student_id: studentId,
        student_name: usersInfoWithKeys[studentId]?.name || 'Unknown User',
        avatar: usersInfoWithKeys[studentId]?.avatar || null,
      });
    }
  });

  return groups;
};

export const getStudentsScoreByDay = async (
  classId: string,
  timezone: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any>[] | null> => {
  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_SCORE);
  let tableName = 'reporting_spr_perform_by_score_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_perform_by_score_B';
  }

  const timezoneInSeconds = timezone * 60 * 60;
  const nowTimestampSQL = `UNIX_TIMESTAMP() + ${timezoneInSeconds}`;
  const sevenDaysAgoTimestampSQL = `(${nowTimestampSQL} - (${SPS_INTERVAL_IN_DAYS} * 3600 * 24))`;

  return await prisma.$queryRawUnsafe(
    `
    SELECT
      student_id,
      (SUM(achieved_score) * 100 / SUM(total_score)) AS score,
      CASE WHEN start_at = 0 THEN
        DATE_FORMAT(FROM_UNIXTIME(due_at + ${timezoneInSeconds}), '%Y-%m-%d')
      ELSE
        DATE_FORMAT(FROM_UNIXTIME(start_at + ${timezoneInSeconds}), '%Y-%m-%d')
      END AS d
    FROM
      ${tableName}
    WHERE
      class_id = '${classId}'
    GROUP BY student_id, d
    HAVING
      d >= DATE_FORMAT(FROM_UNIXTIME(${sevenDaysAgoTimestampSQL}), '%Y-%m-%d') AND
      d <= DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d')
    ORDER BY d DESC;
    `
  );
};
