import processor from '../../../src/slate-convert/md-to-html';

// eslint-disable-next-line quotes
const mdString = "```javascript\nconst a = 'nihao';\nconst b = 'wphao';"; // bug

describe('code_block test', () => {
  it('code_block', async () => {
    const data = await processor.process(mdString);
    console.log(data.value);
    const string = String(data);
    const expectResult = `
<pre><code class="language-javascript">const a = 'nihao';
const b = 'wphao';
</code></pre>
`;

    expect(string).toEqual(expectResult);
  });
});
