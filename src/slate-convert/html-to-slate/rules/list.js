import slugid from 'slugid';
import { LIST_ITEM, ORDERED_LIST, PARAGRAPH, UNORDERED_LIST } from '../constants';
import { generateDefaultText } from '../../../extension/core';

const PARAGRAPH_TAGS = ['DIV', 'P'];

const listRule = (element, parseChild) => {
  const { nodeName, childNodes, firstChild, parentElement } = element;
  if (nodeName === 'UL') {
    return {
      id: slugid.nice(),
      type: UNORDERED_LIST,
      children: parseChild(childNodes)
    };
  }
  if (nodeName === 'OL') {
    return {
      id: slugid.nice(),
      type: ORDERED_LIST,
      children: parseChild(childNodes)
    };
  }
  if (nodeName === 'LI' && firstChild && PARAGRAPH_TAGS.includes(firstChild.nodeName)) {
    return {
      id: slugid.nice(),
      type: LIST_ITEM,
      children: parseChild(childNodes)
    };
  }

  if (nodeName === 'LI' && firstChild && !PARAGRAPH_TAGS.includes(firstChild.nodeName)) {
    return {
      id: slugid.nice(),
      type: LIST_ITEM,
      children: [{
        id: slugid.nice(),
        type: PARAGRAPH,
        children: parseChild(childNodes)
      }]
    };
  }

  if (PARAGRAPH_TAGS.includes(nodeName) && parentElement && parentElement.nodeName === 'LI') {
    if (Array.from(childNodes).length === 0) {
      return {
        id: slugid.nice(),
        type: PARAGRAPH,
        children: [
          generateDefaultText(),
        ]
      };
    }
    return {
      id: slugid.nice(),
      type: PARAGRAPH,
      children: parseChild(childNodes)
    };
  }
  return;
};

export default listRule;
