import slugid from 'slugid';
import { generateDefaultText } from '../../extension/core';
import {
  BLOCKQUOTE,
  HEADER,
  IMAGE,
  LINK,
  PARAGRAPH,
  TABLE,
  CODE_BLOCK,
  LIST_ITEM,
  ORDERED_LIST,
  UNORDERED_LIST,
  CHECK_LIST_ITEM,
  CODE_LINE,
  TABLE_ROW,
  TABLE_CELL,
} from '../../extension/constants/element-types';

const INLINE_KEY_MAP = {
  strong: 'bold',
  emphasis: 'italic',
};

// <strong><em>aa<em>bb<em></strong>
const applyMarkForInlineItem = (result, item, textNode = {}) => {
  const { type, children, value } = item;

  if (type === LINK) {
    const child = children.length === 0 ? {type: 'text', value: ''} : children[0];
    const data = {
      url: item.url,
      title: child.value,
    };
    const linkChildren = [{ id: slugid.nice(), text: child.value }];
    const link = {
      id: slugid.nice(),
      type: LINK,
      data,
      children: linkChildren,
    };
    result.push([
      generateDefaultText(),
      link,
      generateDefaultText(),
    ]);
    return result;
  }

  if (type === IMAGE) {
    const data = {
      src: item.url,
      ...(item.title && { title: item.title }),
      ...(item.alt && { alt: item.alt }),
      ...(item.width && { width: item.width }),
      ...(item.height && { height: item.height }),
    };
    const image = {
      id: slugid.nice(),
      data: data,
      children: [generateDefaultText()]
    };
    result.push([
      generateDefaultText(),
      image,
      generateDefaultText(),
    ]);
    return result;
  }

  if (type === 'text') {
    textNode['text'] = value || '';
    result.push(textNode);
    return;
  }

  if (type === 'inlineCode') {
    textNode['code'] = true;
    textNode['text'] = value || '';
    result.push(textNode);
    return;
  }

  const attr_key = INLINE_KEY_MAP[type];
  if (!Array.isArray(children) || children.length === 0 || !attr_key) {
    textNode['text'] = value || '';
    result.push(textNode);
    return;
  }

  textNode[attr_key] = true;
  children.forEach(item => {
    applyMarkForInlineItem(result, item, textNode);
  });
};

const transformNodeWithInlineChildren = (node) => {
  const { children } = node;
  const defaultChildren = [generateDefaultText()];
  if (!children || !Array.isArray(children) || children.length === 0) {
    return defaultChildren;
  }
  const result = [];
  children.forEach(item => applyMarkForInlineItem(result, item));
  return result.flat();
};

export const transformHeader = (node) => {
  const { depth } = node;
  const type = `${HEADER}${depth}`;
  return {
    id: slugid.nice(),
    type: type,
    children: transformNodeWithInlineChildren(node),
  };
};

export const transformParagraph = (node) => {
  return {
    id: slugid.nice(),
    type: PARAGRAPH,
    children: transformNodeWithInlineChildren(node),
  };
};

export const transformBlockquote = (node) => {
  const {  children } = node;
  return {
    id: slugid.nice(),
    type: BLOCKQUOTE,
    children: children.map(child => {
      const handler = elementHandlers[child.map];
      return handler(child);
    })
  };
};

export const transformListLic = (node) => {
  const { children } = node;
  return {
    id: slugid.nice(),
    type: PARAGRAPH,
    children: children.map(child => transformNodeWithInlineChildren(child)).flat(),
  };
};

export const transformListItem = (node) => {
  const { children } = node;
  return {
    id: slugid.nice(),
    type: LIST_ITEM,
    children: children.map(child => transformListLic(child)),
  };
};

export const transformOrderedList = (node) => {
  const { children } = node;
  return {
    id: slugid.nice(),
    type: ORDERED_LIST,
    children: children.map(child => transformListItem(child)),
  };
};

export const transformUnorderedList = (node) => {
  const { children } = node;
  return {
    id: slugid.nice(),
    type: UNORDERED_LIST,
    children: children.map(child => transformListItem(child)),
  };
};

export const transformCheckListItem = (node) => {
  const { children } = node;
  return {
    id: slugid.nice(),
    type: CHECK_LIST_ITEM,
    children: children.map(child => transformNodeWithInlineChildren(child)).flat()
  };
};

export const transformCheckList = (node) => {
  const { children } = node;
  return children.map(child => transformCheckListItem(child));
};

export const transformList = (node) => {
  const { ordered, children } = node;
  const firstChild = children[0];
  if (ordered === true) {
    return transformOrderedList(node);
  }
  if (ordered === false && firstChild.checked === null) {
    return transformUnorderedList(node);
  }
  return transformCheckList(node);
};

export const transformTableCell = (node) => {
  const { children } = node;
  return {
    id: slugid.nice(),
    type: TABLE_CELL,
    children: children.map(child => transformNodeWithInlineChildren(child)),
  };
};

export const transformTableRow = (node) => {
  const { children } = node;
  return {
    id: slugid.nice(),
    type: TABLE_ROW,
    children: children.map(child => transformTableRow(child)),
  };
};

export const transformTable = (node) => {
  const { children } = node;
  return {
    id: slugid.nice(),
    type: TABLE,
    children: children.map(child => transformTableRow(child)),
  };
};

export const transformCodeLine = (text) => {
  return {
    id: slugid.nice(),
    type: CODE_LINE,
    children: {
      id: slugid.nice(),
      text: text,
    }
  };
};

export const transformCodeBlock = (node) => {
  const { lang, value } = node;
  const children = value.splice('\n');
  return {
    id: slugid.nice(),
    type: CODE_BLOCK,
    language: lang,
    children: children.map(text => transformCodeLine(text)),
  };
};

export const transformHr = (node) => {
  return {
    type: 'hr',
    children: [
      generateDefaultText(),
    ]
  };
};

const elementHandlers = {
  'paragraph': transformParagraph,
  'heading': transformHeader,
  'blockquote': transformBlockquote,
  'table': transformTable,
  'list': transformList,
  'code': transformCodeBlock,
  'thematicBreak': transformHr,
};

export const formatMdToSlate = (children) => {
  const validChildren = children.filter(child => elementHandlers[child.type]);
  return validChildren.map(child => {
    const handler = elementHandlers[child.type];
    return handler(child);
  });
};


