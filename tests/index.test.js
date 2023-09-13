import Add from '../src/index';

describe('test add function', () => {
  it('add function', () => {
    const count = Add(4, 5);
    expect(count).toBe(9);
  });
});
