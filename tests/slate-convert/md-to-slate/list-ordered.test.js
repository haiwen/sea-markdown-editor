import mdStringToSlate from '../../../src/slate-convert/md-to-slate';
import { formatChildren } from '../../core';

describe('ordered_list test', () => {
  it('blockquote > list', () => {
    const mdString = '1. list_item1 \n2. list_item2 \n    1. list_item_child 2.1 \n    2. list_item_child 2.2 ';
    const nodes = mdStringToSlate(mdString);
    const expectResult = [{
      type: 'ordered_list',
      children: [
        {
          type: 'list_item',
          children: [
            { type: 'paragraph', children: [{ text: 'list_item1' }] },
          ]
        },
        {
          type: 'list_item',
          children: [
            { type: 'paragraph', children: [{ text: 'list_item2' }] },
            { type: 'ordered_list', children: [
              {
                type: 'list_item',
                children: [
                  { type: 'paragraph', children: [{ text: 'list_item_child 2.1' }] },
                ]
              },
              {
                type: 'list_item',
                children: [
                  { type: 'paragraph', children: [{ text: 'list_item_child 2.2' }] },
                ]
              },
            ] },
          ]
        }
      ]
    }];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });
});

describe('ordered_list test', () => {
  it('blockquote > list', () => {
    const mdString = `1. nihaode \n2. wohenhao \n    1. xiexieni\n    2. bukeqi\n        - [x] Write the press release\n        - [ ] Update the website\n        - [ ] Contact the media\n    3. niuniu\n3. woyehenhao\n4. nihaode`;
    const nodes = mdStringToSlate(mdString);
    console.log(nodes);
    const expectResult = [{
      type: 'ordered_list',
      children: [
        {
          type: 'list_item',
          children: [
            { type: 'paragraph', children: [{ text: 'nihaode' }] },
          ]
        },
        {
          type: 'list_item',
          children: [
            { type: 'paragraph', children: [{ text: 'wohenhao' }] },
            { type: 'ordered_list', children: [
              {
                type: 'list_item',
                children: [
                  { type: 'paragraph', children: [{ text: 'xiexieni' }] },
                ]
              },
              {
                type: 'list_item',
                children: [
                  { type: 'paragraph', children: [{ text: 'bukeqi' }] },
                  { type: 'unordered_list', children: [
                    {
                      type: 'list_item',
                      children: [
                        { type: 'paragraph', children: [{ text: 'Write the press release' }] },
                      ]
                    },
                    {
                      type: 'list_item',
                      children: [
                        { type: 'paragraph', children: [{ text: 'Update the website' }] },
                      ]
                    },
                    {
                      type: 'list_item',
                      children: [
                        { type: 'paragraph', children: [{ text: 'Contact the media' }] },
                      ]
                    },
                  ] },
                ]
              },
              {
                type: 'list_item',
                children: [
                  { type: 'paragraph', children: [{ text: 'niuniu' }] },
                ]
              },
            ] }
          ]
        },
        {
          type: 'list_item',
          children: [
            { type: 'paragraph', children: [{ text: 'woyehenhao' }] },
          ]
        },
        {
          type: 'list_item',
          children: [
            { type: 'paragraph', children: [{ text: 'nihaode' }] },
          ]
        },
      ]
    }];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });
});
