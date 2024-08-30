import slugid from 'slugid';
import { TABLE, TABLE_CELL, TABLE_ROW } from '../constants';

const tableRule = (element, parseChild) => {
  const { nodeName, childNodes } = element;
  if (nodeName === 'TABLE') {
    return {
      id: slugid.nice(),
      type: TABLE,
      align: [],
      children: parseChild(childNodes)
    };
  }

  if (nodeName === 'THEAD' || nodeName === 'TBODY') {
    return parseChild(childNodes);
  }

  if (nodeName === 'TR' && childNodes.length > 0) {
    // patch
    // console.log("tr", childNodes);
    const children = Array.from(childNodes);
    const hasTdOrTh = children.some(item => item.nodeName === 'TH' || item.nodeName === 'TD');
    if (!hasTdOrTh) return;
    return {
      id: slugid.nice(),
      type: TABLE_ROW,
      children: parseChild(childNodes)
    };
  }

  if (nodeName === 'TH' || nodeName === 'TD') {
    return {
      id: slugid.nice(),
      type: TABLE_CELL,
      children: parseChild(childNodes)
    };
  }

  //Replace paragraph node with text node
  if (nodeName === 'P') {
    const textContent = childNodes[0]?.outerText || '';
    return {
      id: slugid.nice(),
      type: 'text',
      text: textContent
    };
  }

  return;
};

export default tableRule;
