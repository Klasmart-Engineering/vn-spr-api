import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { when } from 'jest-when';
import prisma from 'src/prismaClient';
import { getClassesInIdsSQL, getTodaySchedulesSQL, getTodayStudentsScoreSQL } from 'src/utils';

jest.mock('src/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(async () => {
  mockReset(prismaMock);
  mockAllSwithTables();
  await mockGetClassesByClassIds();
  await mockGetTodaySchedules();
  await mockGetTodayStudentsScore();
});

const mockAllSwithTables = () => {
  prismaMock.switchTable.findUnique.mockResolvedValue({
    datasetId: '',
    verInUse: 'A',
    updateAt: new Date(),
  });
};

const mockGetClassesByClassIds = async () => {
  when(prismaMock.$queryRaw)
    .calledWith(
      await getClassesInIdsSQL('051f6f59-ddf7-4d4a-9b88-d536235bae43', [
        '13d94984-0bfa-4d1a-b01c-927f8fa3c86e',
        '367ce372-9058-4212-a00e-33d4b9bbf164',
        '7f78aeac-a8e2-4c4e-b819-458403b68854',
        '82c608c3-3de2-4ea6-b5e2-358ab7f7cc11',
        'c332d35c-1866-4d23-a4e7-7b309a9ce576',
        'dffb33b4-8589-40c8-8779-311a26aee82c',
      ])
    )
    .mockResolvedValue([
      {
        classId: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e',
        className: 'Class1B Test',
        totalStudents: 10,
        studentIds: [
          'acf3e530-f6bd-46c0-85f5-33b3919cbd02',
          'f58fa74b-a9de-480a-b3a9-5a38223ff9dd',
          '0debe787-02e7-42b1-a7df-43d87de7efbe',
          'fbb74d81-e559-4df3-85fb-669ee2bf8fda',
          '9dcde3dc-4ecb-4b3d-93ba-1507c04b7174',
          '5d71353e-771b-4502-8cf1-fa5444035263',
          '6100a0e3-a9e8-4d9e-b416-628a8b95f8b5',
          '22ca240c-604a-4dba-86db-63ad3037323c',
          '685f0bd5-8350-4184-a3a5-a33fabc743bb',
          '2f664616-b4a6-4a9a-a378-8f25138cc834',
        ],
      },
      {
        classId: '367ce372-9058-4212-a00e-33d4b9bbf164',
        className: 'Class1D',
        totalStudents: 5,
        studentIds: [
          '02c009b8-8d6f-42b9-8d69-507cea3cd498',
          '97d08020-5196-4be6-8e58-5965106a17bd',
          '0a0a89fa-46d8-4454-b3d7-cbf884dd4428',
          '0b1ad554-a7e3-4523-aabb-967acbb6bfd7',
          '9aaf5f93-94b4-492f-bf88-e9b11a9352a3',
        ],
      },
      {
        classId: '7f78aeac-a8e2-4c4e-b819-458403b68854',
        className: 'Class1C',
        totalStudents: 5,
        studentIds: [
          '8e2ed588-0a66-422e-916a-8e707b39ab55',
          '4990ff57-9212-4ffb-a12f-caeb76ef7745',
          'e286d183-c7fd-4208-8818-918c48960e6a',
          'd86aee85-c06e-4127-97f9-0c53be218874',
          '0726c36d-0633-4a41-bc6b-60e6207c2f84',
        ],
      },
    ]);
};

const mockGetTodaySchedules = async () => {
  when(prismaMock.$queryRaw)
    .calledWith(
      await getTodaySchedulesSQL('051f6f59-ddf7-4d4a-9b88-d536235bae43', 7)
    )
    .mockResolvedValue([
      {scheduleId: '11645d5b-968c-4977-8aed-c744526a3998', classId: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e', totalActivities: 10},
      {scheduleId: 'c270fd8d-c9e7-4419-af15-866809715b99', classId: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e', totalActivities: 8},
      {scheduleId: '5aa5b71c-5b59-4940-8fd4-9c786d7f1d79', classId: '367ce372-9058-4212-a00e-33d4b9bbf164', totalActivities: 5},
      {scheduleId: '1fc5ead0-7f44-4ee2-8401-b67f4c7e8267', classId: '7f78aeac-a8e2-4c4e-b819-458403b68854', totalActivities: 3},
    ]);
};

const mockGetTodayStudentsScore = async () => {
  when(prismaMock.$queryRaw)
  .calledWith( await getTodayStudentsScoreSQL('051f6f59-ddf7-4d4a-9b88-d536235bae43', 7))
  .mockResolvedValue([
    {classId: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e', studentId: 'acf3e530-f6bd-46c0-85f5-33b3919cbd02', sps: 80, day: new Date().toISOString().slice(0,10)},
      {classId: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e', studentId: 'f58fa74b-a9de-480a-b3a9-5a38223ff9dd', sps: 70, day: new Date().toISOString().slice(0,10)},
      {classId: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e', studentId: '0debe787-02e7-42b1-a7df-43d87de7efbe', sps: 60, day: new Date().toISOString().slice(0,10)},
      {classId: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e', studentId: '82c608c3-3de2-4ea6-b5e2-358ab7f7cc11', sps: 40, day: new Date().toISOString().slice(0,10)},
  ])
}

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
