const generateDefaultText = () => {
  return {
    type: 'text',
    value: '',
  };
};

const transformTextNode = (textNode) => {
  const marks = Object.keys(textNode);
  let mdNode = { type: 'text', value: textNode.text };

  // code = true, override text type
  if (marks['code']) {
    mdNode = { ...mdNode, type: 'inlineCode' };
  }

  // blob = true, add strong parent
  if (marks['blob']) {
    mdNode = { type: 'strong', children: [mdNode] };
  }

  // italic = true, add emphasis parent
  if (marks['italic']) {
    mdNode = { type: 'emphasis', children: [mdNode] };
  }

  return mdNode;
};

const transformInlineChildren = (result, item) => {
  // image
  if (item.type && item.type === 'image') {
    const { data } = item;
    const image = {
      type: 'image',
      url: data.src,
      alt: data.alt || null,
      title: data.title || null,
      data: {
        ...(data.width && { width: data.width }),
        ...(data.height && { width: data.height }),
      }
    };
    result.push(image);
    return result;
  }

  // link
  if (item.type && item.type === 'link') {
    const link = {
      type: 'link',
      url: item.data.href,
      title: item.data.title ? item.data.title : null,
      children: transformTextNode(item.children[0]),
    };
    result.push(link);
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
    if (child.type === 'list_item') {
      return transformListContent(child);
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

const transformTableCell = (node) => {
  return {
    type: 'tableCell',
    children: transformNodeWithInlineChildren(node),
  };
};

const transformTableRow = (node) => {
  const { children } = node;
  return {
    type: 'tableRow',
    children: children.map(child => transformTableCell(child)),
  };
};

const transformTable = (node) => {
  const { children } = node;
  return {
    type: 'table',
    children: children.map(child => transformTableRow(child)),
  };
};

const transformCodeLine = (node) => {
  const text = node.children[0]?.text || '';
  return text + '\n';
};

const transformCodeBlock = (node) => {
  const { children } = node;
  return {
    type: 'code',
    lang: node.lang ? node.lang : null,
    value: children.map(child => transformCodeLine(child)).join(''),
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
  'code': transformCodeBlock,
};

export const formatSlateToMd = (children) => {
  const validChildren = children.filter(child => elementHandlers[child.type]);
  return validChildren.map(child => {
    const handler = elementHandlers[child.type];
    return handler(child);
  }).flat();
};
