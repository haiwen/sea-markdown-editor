import slateToMdString from '../../../src/slate-convert/slate-to-md';

describe('paragraph test', () => {
  it('paragraph', () => {
    const nodes = [
      {
        type: 'paragraph',
        children: [
          { text: '' }
        ]
      },
    ];

    const expectResult = '';

    expect(slateToMdString(nodes)).toEqual(expectResult);
  });
});
