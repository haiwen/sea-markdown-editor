import processor from '../../../src/slate-convert/md-to-html';

const mdString = '**`nihaode`**';
describe('paragraph test', () => {
  it('paragraph > strong > code', async () => {
    const data = await processor.process(mdString);
    const string = String(data);
    const expectResult = `
<p><strong><code>nihaode</code></strong></p>
`;

    expect(string).toEqual(expectResult);
  });
});
