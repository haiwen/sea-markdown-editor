import isUrl from 'is-url';
import slugid from 'slugid';
import { LINK } from '../constants';

const textRule = (element, parseChild) => {
  const { nodeName, nodeType } = element;

  if (nodeName === 'SPAN') {
    if (isUrl(element.textContent)) {
      return {
        id: slugid.nice(),
        type: LINK,
        url: element.textContent,
        title: '',
        children: [
          {
            id: slugid.nice(),
            text: element.textContent,
          }
        ]
      };
    }
    return {
      id: slugid.nice(),
      text: element.textContent,
    };
  }

  if (nodeName === 'STRONG' || nodeName === 'B') {
    return {
      id: slugid.nice(),
      bold: true,
      text: element.textContent,
    };
  }

  if (nodeName === 'CODE' && element.parentElement.nodeName !== 'PRE') {
    return {
      id: slugid.nice(),
      code: true,
      text: element.textContent
    };
  }

  if (nodeName === 'DEL') {
    return {
      id: slugid.nice(),
      delete: true,
      text: element.textContent
    };
  }

  if (nodeName === 'I') {
    return {
      id: slugid.nice(),
      italic: true,
      text: element.textContent
    };
  }

  if (nodeName === 'INS') {
    return {
      id: slugid.nice(),
      add: true,
      text: element.textContent
    };
  }

  if (nodeType === 3) {
    return {
      id: slugid.nice(),
      text: element.textContent,
    };
  }

  return;
};

export default textRule;
