import { requestStore } from '..';

test('when created the request store is usable within a promise', async () => {
  await requestStore.getStore().runPromise(async () => {
    requestStore.set('test', 'TestValue');
    expect(requestStore.get('test')).toBe('TestValue');
  });
});
