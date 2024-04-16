import mdStringToSlate from '../../../src/slate-convert/md-to-slate';
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

describe('check list test with check_list child', () => {
  it('check list', () => {
    const mdString = '- [x] Write the press release \n    - [x] Write the press release \n    - [ ] Update the website \n    - [ ] Contact the media\n- [ ] Update the website \n- [ ] Contact the media';
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

describe('check list test with no child', () => {
  it('check list', () => {
    const mdString = '- [x] Write the press release \n-\n-';
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
          { text: '' },
        ]
      },
      {
        type: 'check_list_item',
        checked: false,
        children: [
          { text: '' },
        ]
      },
    ];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });
});
