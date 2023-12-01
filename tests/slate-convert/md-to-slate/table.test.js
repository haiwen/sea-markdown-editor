import mdStringToSlate from '../../../src/slate-convert/md-to-slate';
import { formatChildren } from '../../core';

describe('table test', () => {
  it('table', () => {
    const mdString = '|name|sex|age| \n |-|-|-| \n |alex|man|24|';
    const nodes = mdStringToSlate(mdString);
    const expectResult = [
      {
        type: 'table',
        children: [
          {
            type: 'table_row',
            children: [
              { type: 'table_cell', align: null, children: [{ text: 'name' }] },
              { type: 'table_cell', align: null, children: [{ text: 'sex' }] },
              { type: 'table_cell', align: null, children: [{ text: 'age' }] },
            ]
          },
          {
            type: 'table_row',
            children: [
              { type: 'table_cell', align: null, children: [{ text: 'alex' }] },
              { type: 'table_cell', align: null, children: [{ text: 'man' }] },
              { type: 'table_cell', align: null, children: [{ text: '24' }] },
            ]
          }
        ]
      },
    ];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });
});
