import { processor } from '../../../src/slate-convert/md-to-html';

const mdString = '**nihaode**';
describe('paragraph test', () => {
  it('paragraph > bold', async () => {
    const data = await processor.process(mdString);
    const string = String(data);
    const expectResult = `
<p><strong>nihaode</strong></p>
`;

    expect(string).toEqual(expectResult);
  });
});
