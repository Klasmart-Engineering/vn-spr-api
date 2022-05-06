import ClassController from 'src/controllers/v1/class';

xtest('should return response', async () => {
  const controller = new ClassController();
  const response = await controller.getClasses('d51bba25-5d5e-4dab-ad47-1192eb8fc0c0');
  expect(typeof response).toEqual('object');
});
