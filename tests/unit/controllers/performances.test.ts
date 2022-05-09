import PerformancesController from 'src/controllers/v1/performance';

test('GetPerformanceScores should return an array', async () => {
  const controller = new PerformancesController();
  const scores = await controller.getPerformanceScores(7200);
  expect(Array.isArray(scores)).toBe(true);
});

// test('getPerformanceGroups should return response', async () => {
//   const controller = new PerformancesController();
//   const response = await controller.getPerformanceGroups('classId', 7, {});
//   expect(typeof response).toEqual('object');
// });

test('GetSkillScores should return an array', async () => {
  const controller = new PerformancesController();
  const response = await controller.getSkillScores();
  expect(Array.isArray(response)).toBe(true);
});
