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

// slateNode -> mdast -> mdString
const slateToMdString = (value) => {
  if (!isContentValid(value)) return '';
  if (value.length === 0) return '';

  if (value.length === 1) {
    const child = value[0];
    if (child.type === PARAGRAPH && Node.string(child).length === 0) {
      return '';
    }
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
