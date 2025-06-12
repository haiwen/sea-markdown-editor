import { processor } from '../../../src/slate-convert/md-to-html';

const mdString = '![Alt text][logo]\n\n[logo]: /logo.png "title"';

describe('image test', () => {
  it('paragraph > image', async () => {
    const result = await processor.process(mdString);
    const string = String(result);
    const expectResult = `
<p>
  <img src="/logo.png" alt="Alt text" title="title">
</p>
`;

    expect(string).toEqual(expectResult);
  });
});
