import { mdStringToSlate } from '../../../src/slate-convert/md-to-slate';
import { formatChildren } from '../../core';

describe('check list test', () => {
  it('check list', () => {
    const mdString = '- [x] Write the press release \n- [ ] Update the website \n- [ ] Contact the media';
    const nodes = mdStringToSlate(mdString);
    const expectResult = [
      {
        type: 'check_list_item',
        checked: true,
        children: [
          { text: 'Write the press release' },
        ]
      },
      {
        type: 'check_list_item',
        checked: false,
        children: [
          { text: 'Update the website' },
        ]
      },
      {
        type: 'check_list_item',
        checked: false,
        children: [
          { text: 'Contact the media' },
        ]
      },
    ];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });
});
