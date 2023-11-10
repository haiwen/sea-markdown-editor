import { unified } from 'unified';
import remarkStringify from 'remark-stringify';
import remarkMath from 'remark-math';
import { Node } from 'slate';
import { ELementTypes, isEmptyParagraph } from '../extension';

const isContentValid = (value) => {
  if (!value || !Array.isArray(value)) return false;
  return true;
};

function _getCodeValue(node) {
  // code > bold | code > italic
  // code > bold > italic | code > italic > italic
  if (node && node.children) {
    node = node.children[0];
    return _getCodeValue(node);
  }
  return node.value;
}

const updateNodeWithMark = (node, markString) => {
  switch (markString) {
    case 'BOLD':
      return {
        type: 'strong',
        children: [
          node
        ]
      };
    case 'ITALIC':
      return {
        type: 'emphasis',
        children: [
          node
        ]
      };
    case 'CODE':
      return {
        type: 'inlineCode',
        value: _getCodeValue(node)
      };
    default:
      console.log('unknown mark string: ' + markString);
      return node;
  }
};

const formatTextNode = (textNode) => {
  const textKeys = Object.keys(textNode);
  const marks = textKeys.filter(key => textNode[key] && key !== 'text');
  let mdNode = { type: 'text', value: textNode.text };
  if (marks.length > 0) {
    for (let mark of marks) {
      mdNode = updateNodeWithMark(mdNode, mark);
    }
  }
  return mdNode;
};

const formatElementNodeChildren = (children) => {
  return children.map(item => formatSlateNode(item));
};

const formatElementNode = (elementNode) => {
  const { type, children } = elementNode;

  // paragraph
  if (type === ELementTypes.PARAGRAPH) {
    return {
      type: ELementTypes.PARAGRAPH,
      children: formatElementNodeChildren(children)
    };
  }

  // header1 header2 header3 header4 header5
  if (type && type.includes(ELementTypes.HEADER)) {
    const level = type.replace(ELementTypes.HEADER, '');
    return {
      type: 'heading',
      depth: parseInt(level),
      children: formatElementNodeChildren(elementNode.children)
    };
  }

  // ordered_list unordered_list
  if (type === ELementTypes.ORDERED_LIST || type === ELementTypes.UNORDERED_LIST) {
    // is ordered list
    const ordered = type === ELementTypes.ORDERED_LIST;
    const mdNodes = formatElementNodeChildren(elementNode.children);
    const loose = mdNodes.some(node => node.loose);
    return {
      type: 'list',
      ordered: ordered,
      start: 1,
      loose: loose,
      children: mdNodes
    };
  }

  if (type === ELementTypes.LIST_ITEM) {
    const mdNodes = formatElementNodeChildren(elementNode.children);
    let loose = false;
    if (mdNodes) {
      if (mdNodes.length === 1) {
        loose = false;
      } else if (mdNodes.length === 2 && mdNodes[2].type === 'list') {
        loose = true;
      } else {
        loose = true;
      }
    }
    return {
      type: 'listItem',
      loose: loose,
      children: mdNodes
    };
  }

  if (type === ELementTypes.CODE_BLOCK) {
    const mdNodes = formatElementNodeChildren(elementNode.children);
    return {
      type: 'code',
      lang: elementNode.data.syntax ? elementNode.data.syntax : null,
      value: mdNodes.join('')
    };
  }

  if (type === ELementTypes.CODE_LINE) {
    return Node.text(elementNode) + '\n';
  }

  if (type === ELementTypes.TABLE) {
    const aligns = elementNode.children[0]?.children?.map(cell => {
      const alignment = cell.data ? cell.data.align : 'left';
      return alignment;
    });
    const mdNodes = formatElementNodeChildren(elementNode.children);
    return {
      type: 'table',
      align: aligns,
      children: mdNodes,
    };
  }

  if (type === ELementTypes.TABLE_ROW) {
    const mdNodes = formatElementNodeChildren(elementNode.children);
    return {
      type: 'tableRow',
      children: mdNodes,
    };
  }

  if (type === ELementTypes.TABLE_CELL) {
    const mdNodes = formatElementNodeChildren(elementNode.children);
    return {
      type: 'tableCell',
      children: mdNodes,
    };
  }

  if (type === ELementTypes.BLOCKQUOTE) {
    const mdNodes = formatElementNodeChildren(elementNode.children);
    return {
      type: 'blockquote',
      children: mdNodes,
    };
  }

  if (type === ELementTypes.IMAGE) {
    // const mdNode = formatElementNodeChildren(elementNode.children);
    const { data } = elementNode;
    if (data.width || data.height) {
      const attrs = Object.keys(data).map(key => {
        return `${key}="${data[key]}"`;
      });
      const html = `<img ${attrs.join(' ')}>`;
      return {
        type: 'html',
        value: html,
      };
    }
    return {
      type: 'image',
      url: data.src,
      alt: data.alt || null,
      title: data.title || null,
    };
  }

  if (type === ELementTypes.LINK) {
    const mdNodes = formatElementNodeChildren(elementNode);
    return {
      type: 'link',
      url: elementNode.data.href,
      title: elementNode.data.title ? elementNode.data.title : null,
      children: mdNodes
    };
  }

  // formula

  // column

  const mdNodes = formatElementNodeChildren(elementNode.children);
  return {
    type: 'paragraph',
    children: mdNodes
  };

};

const formatSlateNode = (node) => {
  // node is text
  if (!node.children) return formatTextNode(node);
  return formatElementNode(node);
};

const formatSlateContent = (value) => {
  // current doc is ''
  if (value.length === 1 && isEmptyParagraph(value[0])) return '';
  const children = value.map(item => formatSlateNode(item));

  const root = {
    type: 'root',
    children: children,
  };
  return root;
};

// slateNode -> mdast -> mdString
const slateToMdString = (value) => {
  if (!isContentValid(value)) return '';
  // slateNode -> mdast
  // https://github.com/syntax-tree/mdast#phrasingcontent
  const mdASTNodes = formatSlateContent(value);

  // convert slate value to md
  const stringifyOptions = {
    rule: '-',
    ruleSpaces: false,
    listItemIndent: 1,
    bullet: '*',
    commonmarks: true,
    fences: true,
  };
  const res = unified()
    .use(remarkStringify, stringifyOptions)
    .use(remarkMath)
    .stringify(mdASTNodes);
  return res;
};

export default slateToMdString;
