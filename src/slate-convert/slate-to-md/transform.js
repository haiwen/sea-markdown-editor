import isLastCharPunctuation from '../../utils/is-punctuation-mark';

const generateDefaultText = () => {
  return {
    type: 'text',
    value: '',
  };
};

const transformTextNode = (textNode) => {
  let mdNode = { type: 'text', value: textNode.text };

  // code = true, override text type
  if (textNode['code']) {
    mdNode = { ...mdNode, type: 'inlineCode' };
  }

  // blob = true, add strong parent
  if (textNode['bold']) {
    mdNode = { type: 'text', value: mdNode.value ? mdNode.value.trim() : '' };
    if (isLastCharPunctuation(mdNode.value)) {
      const value = mdNode.value;
      const mdNode1 = { type: 'text', value: value.substring(0, value.length - 1) };
      const mdNode2 = { type: 'text', value: value.substring(value.length - 1) };
      mdNode = [
        { type: 'strong', children: [mdNode1] },
        mdNode2,
      ];
    } else {
      mdNode = { type: 'strong', children: [mdNode] };
    }
  }

  // italic = true, add emphasis parent
  if (textNode['italic']) {
    mdNode = { type: 'text', value: mdNode.value ? mdNode.value.trim() : '' };
    if (isLastCharPunctuation(mdNode.value)) {
      const value = mdNode.value;
      const mdNode1 = { type: 'text', value: value.substring(0, value.length - 1) };
      const mdNode2 = { type: 'text', value: value.substring(value.length - 1) };
      mdNode = [
        { type: 'emphasis', children: [mdNode1] },
        mdNode2,
      ];
    } else {
      mdNode = { type: 'emphasis', children: [mdNode] };
    }
  }

  return mdNode;
};

const transformInlineChildren = (result, item) => {
  // image
  if (item.type && item.type === 'image') {
    const { data } = item;
    let image = {
      type: 'image',
      url: data.src,
      alt: data.alt || null,
      title: data.title || null,
    };
    if (data.height || data.width) {
      image = {
        type: 'html',
        value: `<img src="${data.src}" alt="${data.alt}" title="${data.title}" width="${data.width}" height="${data.height}" />`
      };
    }
    result.push(image);
    return result;
  }

  // link
  if (item.type && item.type === 'link') {
    const link = {
      type: 'link',
      url: item.url,
      title: item.title || null,
      children: [transformTextNode(item.children[0])],
    };
    result.push(link);
    return result;
  }

  if (item.type && item.type === 'column') {
    const data = item.data;
    const newNode = { text: `{${data.name}}` };
    const column = transformTextNode(newNode);
    result.push(column);
    return result;
  }

  // text
  const nodes = transformTextNode(item);
  result.push(nodes);
  return result;
};

const transformNodeWithInlineChildren = (node) => {
  const { children } = node;
  const defaultChildren = [generateDefaultText()];
  if (!children || !Array.isArray(children) || children.length === 0) {
    return defaultChildren;
  }
  const result = [];
  children.forEach(item => transformInlineChildren(result, item));
  return result.flat();
};

const transformHeader = (node) => {
  const level = node.type.replace('header', '');
  return {
    type: 'heading',
    depth: parseInt(level),
    children: transformNodeWithInlineChildren(node)
  };
};

const transformParagraph = (node) => {
  return {
    type: 'paragraph',
    children: transformNodeWithInlineChildren(node)
  };
};

const transformBlockquote = (node) => {
  const { children } = node;
  return {
    type: 'blockquote',
    children: children.map(child => {
      const handler = elementHandlers[child.type];
      return handler(child);
    }).flat(), // flat
  };
};

const transformCheckList = (node) => {
  return {
    type: 'list',
    ordered: false,
    start: null,
    spread: false,
    children: [
      {
        type: 'listItem',
        spread: false,
        checked: node.checked,
        children: [
          transformParagraph(node),
        ]
      }
    ],
  };
};

const transformListContent = (node) => {
  return transformParagraph(node);
};

const transformListItem = (node) => {
  let loose = false;
  const { children } = node;
  // eslint-disable-next-line array-callback-return
  const newChildren = children.map(child => {
    if (child.type === 'paragraph') {
      return transformListContent(child);
    }
    if (child.type === 'code_block') {
      return transformCodeBlock(child);
    }
    if (child.type === 'blockquote') {
      return transformBlockquote(child);
    }
    if (child.type === 'unordered_list' || child.type === 'ordered_list') {
      return transformList(child);
    }
  });
  if (newChildren.length === 1) {
    loose = false;
  } else if (newChildren.length === 2 && newChildren[1].type === 'list') {
    loose = true;
  } else {
    loose = true;
  }

  return {
    type: 'listItem',
    loose: loose,
    checked: null,
    children: newChildren
  };
};

const transformList = (node) => {
  const { children } = node;
  const newChildren = children.map(child => transformListItem(child));
  let loose = false;
  for (let node of newChildren) {
    if (node.loose === true) {
      loose = true;
      break;
    }
  }
  return {
    type: 'list',
    ordered: node.type === 'ordered_list', // ordered_list | unordered_list
    start: 1,
    loose: loose,
    children: newChildren,
  };
};

const transformTableCell = (cell) => {
  return {
    type: 'tableCell',
    children: transformNodeWithInlineChildren(cell),
  };
};

const transformTableRow = (row) => {
  const { children: cells } = row;
  return {
    type: 'tableRow',
    children: cells.map(cell => transformTableCell(cell)),
  };
};

const transformTable = (node) => {
  const { children: rows } = node;
  const align = rows.map(row => {
    const { children: cells } = row;
    return cells[0]?.align || null;
  });
  return {
    type: 'table',
    align: align,
    children: rows.map(row => transformTableRow(row)),
  };
};

const transformCodeLine = (node) => {
  const text = node.children[0]?.text || '';
  return text;
};

const transformCodeBlock = (node) => {
  const { children } = node;
  return {
    type: 'code',
    lang: node.lang ? node.lang : null,
    value: children.map(child => transformCodeLine(child)).join('\n'),
  };
};

const transformFormula = (node) => {
  const data = node.data;
  return {
    type: 'math',
    value: data.formula,
  };
};

const elementHandlers = {
  'paragraph': transformParagraph,
  'header1': transformHeader,
  'header2': transformHeader,
  'header3': transformHeader,
  'header4': transformHeader,
  'header5': transformHeader,
  'header6': transformHeader,
  'blockquote': transformBlockquote,
  'table': transformTable,
  'check_list_item': transformCheckList,
  'ordered_list': transformList,
  'unordered_list': transformList,
  'code_block': transformCodeBlock,
  'formula': transformFormula,
};

export const formatSlateToMd = (children) => {
  const validChildren = children.filter(child => elementHandlers[child.type]);
  return validChildren.map(child => {
    const handler = elementHandlers[child.type];
    return handler(child);
  }).flat();
};
