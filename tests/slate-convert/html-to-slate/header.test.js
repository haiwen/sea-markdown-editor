import { formatChildren } from '../../core/utils';
import { deserializeHtml } from '../../../src/slate-convert/html-to-slate';


describe('deserialize header', () => {
  it('header1 to slate node', () => {
    const html = '<h1>Seafile</h1>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'header1',
        children: [
          {
            text: 'Seafile'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('header2 to slate node', () => {
    const html = '<h2>SeaTable</h2>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'header2',
        children: [
          {
            text: 'SeaTable'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });

  it('header3 to slate node', () => {
    const html = '<h3>SeaTable</h3>';

    const ret = deserializeHtml(html);
    const exp = [
      {
        type: 'header3',
        children: [
          {
            text: 'SeaTable'
          }
        ]
      }
    ];
    expect(formatChildren(ret)).toEqual(exp);
  });
});
