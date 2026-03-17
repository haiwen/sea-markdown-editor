import slugid from 'slugid';
import { INLINE_LEVEL_TYPES, LIST_ITEM, ORDERED_LIST, PARAGRAPH, UNORDERED_LIST } from '../constants';
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

  if (nodeName === 'LI') {
    const parsedChildren = parseChild(childNodes);
    const normalizedChildren = Array.isArray(parsedChildren)
      ? parsedChildren
      : parsedChildren ? [parsedChildren] : [];

    const listItemChildren = [];
    let inlineChildren = [];

    const appendInlineParagraph = () => {
      if (inlineChildren.length === 0) return;

      listItemChildren.push({
        id: slugid.nice(),
        type: PARAGRAPH,
        children: inlineChildren,
      });
      inlineChildren = [];
    };

    normalizedChildren.forEach((child) => {
      if (!child) return;

      const isInlineNode = !child.type || INLINE_LEVEL_TYPES.includes(child.type);
      if (isInlineNode) {
        inlineChildren.push(child);
        return;
      }

      appendInlineParagraph();
      listItemChildren.push(child);
    });

    appendInlineParagraph();

    if (listItemChildren.length === 0) {
      listItemChildren.push({
        id: slugid.nice(),
        type: PARAGRAPH,
        children: [generateDefaultText()],
      });
    } else if ([UNORDERED_LIST, ORDERED_LIST].includes(listItemChildren[0].type)) {
      // Ensure nested list item content starts with a paragraph.
      listItemChildren.unshift({
        id: slugid.nice(),
        type: PARAGRAPH,
        children: [generateDefaultText()],
      });
    }

    return {
      id: slugid.nice(),
      type: LIST_ITEM,
      children: listItemChildren,
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
