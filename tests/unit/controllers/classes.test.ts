import ClassController from 'src/controllers/v1/class';

test('should return response', async () => {
  const controller = new ClassController();
  const response = await controller.getClasses();
  expect(typeof response).toEqual('object');
});
