import { formatSlateToMd } from '../../../src/slate-convert/slate-to-md/transform';

describe('image test', () => {
  it('image', () => {
    const nodes = [
      {
        type: 'paragraph',
        children: [
          { text: '' },
          {
            type: 'image',
            data: {
              src: 'image.jpg',
              alt: 'alt text',
              title: 'nihadoe',
            },
            children: [
              { text: '' }
            ]
          },
          { text: '' },
        ]
      },
    ];

    const expectResult = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: '',
          },
          {
            type: 'image',
            url: 'image.jpg',
            alt: 'alt text',
            title: 'nihadoe',
            data: {},
          },
          {
            type: 'text',
            value: '',
          },
        ]
      },
    ];

    expect(formatSlateToMd(nodes)).toEqual(expectResult);
  });
});
