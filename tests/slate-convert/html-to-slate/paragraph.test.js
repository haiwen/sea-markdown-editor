import { formatChildren } from '../../core/utils';
import { deserializeHtml } from '../../../src/slate-convert/html-to-slate';


describe('deserialize p', () => {
  it('p to slate node', () => {
    const html = '<p>Hello, seafile sdoc editor</p>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('no p to slate node', () => {
    const html = '<div>Hello, seafile sdoc editor</div>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Hello, seafile sdoc editor'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

});
