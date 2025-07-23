import { unified } from 'unified';
import { Node } from 'slate';
import markdown from 'remark-parse';
import gfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import remarkMath from 'remark-math';
import { formatSlateToMd } from './transform';
import { PARAGRAPH } from '../html-to-slate/constants';

const isContentValid = (value) => {
  if (!value || !Array.isArray(value)) return false;
  return true;
};

const isEmptyParagraph = (node) => {
  const voidNodeTypes = ['image', 'column', 'formula'];
  if (node.type !== PARAGRAPH) return false;
  const hasBlock = node.children.some(item => voidNodeTypes.includes(item.type));
  const hasHtml = node.children.some(item => item.type === 'html');
  if (hasBlock) return false;
  if (hasHtml) return false;
  if (Node.string(node).length !== 0) return false;
  return true;
};

// slateNode -> mdast -> mdString
const slateToMdString = (value) => {
  if (!isContentValid(value)) return '';
  if (value.length === 0) return '';

  // is only one empty paragraph child
  if (value.length === 1 && isEmptyParagraph(value[0])) {
    return '';
  }

  // slateNode -> mdast
  // https://github.com/syntax-tree/mdast#phrasingcontent
  const mdASTNodes = formatSlateToMd(value);

  const root = {
    type: 'root',
    children: mdASTNodes
  };

  // convert slate value to md
  const stringifyOptions = {
    rule: '-',
    ruleSpaces: false,
    bullet: '*',
    commonmarks: true,
    fences: true,
  };
  const res = unified()
    .use(markdown)
    .use(gfm)
    .use(remarkStringify, stringifyOptions)
    .use(remarkMath)
    .stringify(root);
  return res;
};

// transform rules: https://github.com/syntax-tree/mdast

export default slateToMdString;
