import processor from '../../../src/slate-convert/md-to-html';

const mdString = '`nihaode`';
describe('paragraph test', () => {
  it('paragraph > code', async () => {
    const data = await processor.process(mdString);
    const string = String(data);
    const expectResult = `
<p><code>nihaode</code></p>
`;

    expect(string).toEqual(expectResult);
  });
});
