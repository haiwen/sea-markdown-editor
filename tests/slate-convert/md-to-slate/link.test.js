import { mdStringToSlate } from '../../../src/slate-convert/md-to-slate';
import { formatChildren } from '../../core';

describe('link test', () => {
  it.only('transform link', () => {
    const mdString = '[xiaoqiang](http://127.0.0.1/shuntian/learning/index.html)';
    const nodes = mdStringToSlate(mdString);
    console.log(nodes);
    const expectResult = [{
      type: 'paragraph',
      children: [
        {
          text: '',
        },
        {
          type: 'link',
          data: {
            url: 'http://127.0.0.1/shuntian/learning/index.html',
            title: 'xiaoqiang',
          },
          children: [
            { text: 'xiaoqiang' }
          ]
        },
        {
          text: ''
        }
      ]
    }];

    expect(formatChildren(nodes)).toEqual(expectResult);
  });
});
