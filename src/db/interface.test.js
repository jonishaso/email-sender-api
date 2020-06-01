import mongoInterface from './interface'
it('mongodb testing', async () => {
  const data = await mongoInterface.performFindAll(true)
  expect(data.result).toBeInstanceOf(Array)
})
