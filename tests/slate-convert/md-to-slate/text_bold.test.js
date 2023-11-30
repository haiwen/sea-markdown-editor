import mdStringToSlate from '../../../src/slate-convert/md-to-slate';
import { formatChildren } from '../../core';

describe('paragraph test', () => {
  it('paragraph > bold', () => {
    const mdString = '**nihaode**';
    const nodes = mdStringToSlate(mdString);
    const expectResult = [
      {
        type: 'paragraph',
        children: [
          {
            bold: true,
            text: 'nihaode'
          }
        ]
      },
    ];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });
});
