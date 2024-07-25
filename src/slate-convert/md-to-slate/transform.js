import slugid from 'slugid';
import { generateDefaultText, generateDefaultParagraph } from '../../extension/core';
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
import deserializeHtml from '../html-to-slate';

const INLINE_KEY_MAP = {
  strong: 'bold',
  emphasis: 'italic',
};

// <strong><em>aa<em>bb<em></strong>
const applyMarkForInlineItem = (result, item, textNode = {}) => {
  const { type, children, value } = item;

  if (type === LINK) {
    const child = children.length === 0 ? { type: 'text', value: '' } : children[0];
    const linkChildren = [{ id: slugid.nice(), text: child.value || '' }];
    const link = {
      id: slugid.nice(),
      type: LINK,
      url: item.url,
      title: item.title,
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
      type: IMAGE,
      children: [generateDefaultText()]
    };
    result.push([
      generateDefaultText(),
      image,
      generateDefaultText(),
    ]);
    return result;
  }

  // Handle special images
  if (type === 'html') {
    const nodes = transformHtml(item);
    result.push(nodes);
    return result;
  }

  if (!textNode.id) {
    textNode['id'] = slugid.nice();
  }

  if (type === 'text') {
    // https://symbl.cc/en/200B/
    const formatValue = (value && value !== '​') ? value : '';
    textNode['text'] = formatValue;
    result.push({ ...textNode });

    // reset testNode
    textNode = {};
    return;
  }

  if (type === 'inlineCode') {
    textNode['code'] = true;
    textNode['text'] = value || '';
    result.push({ ...textNode });

    // reset testNode
    textNode = {};
    return;
  }

  const attr_key = INLINE_KEY_MAP[type];
  if (!Array.isArray(children) || children.length === 0 || !attr_key) {
    textNode['text'] = value || '';
    result.push({ ...textNode });

    // reset testNode
    textNode = {};
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
  const { children } = node;
  return {
    id: slugid.nice(),
    type: BLOCKQUOTE,
    children: children.map(child => {
      const handler = elementHandlers[child.type];
      return handler(child);
    }).flat(), // flat
  };
};

export const transformListContent = (node) => {
  return {
    id: slugid.nice(),
    type: PARAGRAPH,
    children: transformNodeWithInlineChildren(node),
  };
};

export const transformListItem = (node) => {
  const { children } = node;
  if (children.length === 0) {
    return {
      id: slugid.nice(),
      type: LIST_ITEM,
      // eslint-disable-next-line array-callback-return
      children: [transformListContent({})]
    };
  }
  return {
    id: slugid.nice(),
    type: LIST_ITEM,
    // eslint-disable-next-line array-callback-return
    children: children.map(child => {
      if (child.type === PARAGRAPH) {
        return transformListContent(child);
      } else if (child.type === 'code') {
        return transformCodeBlock(child);
      } else if (child.type === 'blockquote') {
        return transformBlockquote(child);
      } else if (child.type === 'list') {
        const hasParent = true;
        return transformList(child, hasParent);
      } else if (child.type === 'heading') {
        return transformParagraph(child);
      } else if (child.type === 'html') { // patch
        return transformBlockHtml(child);
      } else if (child.type === 'thematicBreak') { // patch
        return transformParagraph(child);
      } else {
        console.warn('Unhandled child type in list item:', child);
        return generateDefaultParagraph();
      }
    }).flat(),
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
  const { children, checked } = node;
  if (children.length === 0) {
    return {
      id: slugid.nice(),
      type: CHECK_LIST_ITEM,
      checked: checked ? true : false,
      children: transformNodeWithInlineChildren({}),
    };
  }

  if (children.length === 1) {
    return {
      id: slugid.nice(),
      type: CHECK_LIST_ITEM,
      checked: checked ? true : false,
      children: children.map(child => transformNodeWithInlineChildren(child)).flat()
    };
  }

  const [child, ...reset] = children;
  const firstChild = {
    id: slugid.nice(),
    type: CHECK_LIST_ITEM,
    checked: checked,
    children: transformNodeWithInlineChildren(child),
  };

  const resetChildren = formatMdToSlate(reset);
  return [firstChild, ...resetChildren];
};

export const transformCheckList = (node) => {
  const { children } = node;
  return children.map(child => transformCheckListItem(child)).flat();
};

export const transformList = (node, hasParent) => {
  const { ordered, children } = node;
  const firstChild = children[0];
  if (ordered === true) {
    return transformOrderedList(node);
  }
  if (ordered === false && firstChild.checked === null) {
    return transformUnorderedList(node);
  }
  // patch tasklist in list
  if (hasParent) {
    return transformUnorderedList(node);
  }

  return transformCheckList(node);
};

export const transformTableCell = (cell, align) => {
  return {
    id: slugid.nice(),
    type: TABLE_CELL,
    children: transformNodeWithInlineChildren(cell),
  };
};

export const transformTableRow = (row) => {
  const { children: cells } = row;
  return {
    id: slugid.nice(),
    type: TABLE_ROW,
    children: cells.map(cell => transformTableCell(cell)),
  };
};

export const transformTable = (node) => {
  const { children: rows, align = [] } = node;
  return {
    id: slugid.nice(),
    type: TABLE,
    align: align,
    children: rows.map((row, index) => transformTableRow(row)),
  };
};

export const transformCodeLine = (text) => {
  return {
    id: slugid.nice(),
    type: CODE_LINE,
    children: [
      {
        id: slugid.nice(),
        text: text,
      }
    ]
  };
};

export const transformCodeBlock = (node) => {
  const { lang, value } = node;
  let children = value.split('\n');
  if (children.length === 0) {
    children = [''];
  }
  return {
    id: slugid.nice(),
    type: CODE_BLOCK,
    lang: lang,
    children: children.map(text => transformCodeLine(text)),
  };
};

export const transformHr = (node) => {
  return {
    id: slugid.nice(),
    type: 'hr',
    children: [
      generateDefaultText(),
    ]
  };
};

export const transformHtml = (node) => {
  const defaultTextNode = generateDefaultText();
  if (node.value.slice(0, 4).toLowerCase() === '<img') {
    const { body } = new DOMParser().parseFromString(node.value, 'text/html');
    const img = body.firstChild;
    const src = img.getAttribute('src');
    if (!src) return [defaultTextNode];

    const alt = img.getAttribute('alt');
    const title = img.getAttribute('title');
    const width = img.getAttribute('width');
    const height = img.getAttribute('height');
    const data = {
      src: src,
      ...(alt && { alt }),
      ...(title && { title }),
      ...(!isNaN(width) && width > 0 && { width }),
      ...(!isNaN(height) && height > 0 && { height }),
    };
    const image = {
      id: slugid.nice(),
      data: data,
      type: IMAGE,
      children: [generateDefaultText()]
    };
    return [generateDefaultText(), image, generateDefaultText()];
  }

  return [defaultTextNode];
};

export const transformBlockHtml = (node) => {
  if (node.value.slice(0, 4).toLowerCase() === '<img') {
    return {
      id: slugid.nice(),
      type: PARAGRAPH,
      children: transformHtml(node),
    };
  }

  return deserializeHtml(node.value);
};

export const transformMath = (node) => {
  return {
    id: slugid.nice(),
    type: 'formula',
    data: {
      formula: node.value
    },
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
  'list': transformList, // ordered_list | unordered_list | check_list_item
  'code': transformCodeBlock,
  'thematicBreak': transformHr,
  'math': transformMath,
  'html': transformBlockHtml,
};

export const formatMdToSlate = (children) => {
  const validChildren = children.filter(child => elementHandlers[child.type]);
  return validChildren.map(child => {
    const handler = elementHandlers[child.type];
    return handler(child);
  }).flat();
};

