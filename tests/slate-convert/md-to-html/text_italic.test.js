import { processor } from '../../../src/slate-convert/md-to-html';

const mdString = '*nihaode*';
describe('paragraph test', () => {
  it('paragraph > italic', async () => {
    const data = await processor.process(mdString);
    const string = String(data);
    const expectResult = `
<p><em>nihaode</em></p>
`;

    expect(string).toEqual(expectResult);
  });
});
