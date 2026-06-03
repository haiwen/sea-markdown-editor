import slateToMdString from '../../../src/slate-convert/slate-to-md';

describe('slateToMdString list test', () => {
  it('serializes compact unordered lists without blank lines', () => {
    const nodes = [{
      type: 'unordered_list',
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
            { type: 'unordered_list', children: [
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

    const expectResult = '* list\\_item1\n* list\\_item2\n  * list\\_item\\_child 2.1\n  * list\\_item\\_child 2.2\n';

    expect(slateToMdString(nodes)).toEqual(expectResult);
  });
});
