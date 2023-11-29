import { unified } from 'unified';
import remarkStringify from 'remark-stringify';
import remarkMath from 'remark-math';
import { formatSlateToMd } from './transform';

const isContentValid = (value) => {
  if (!value || !Array.isArray(value)) return false;
  return true;
};

// slateNode -> mdast -> mdString
const slateToMdString = (value) => {
  if (!isContentValid(value)) return '';
  // slateNode -> mdast
  // https://github.com/syntax-tree/mdast#phrasingcontent
  const mdASTNodes = formatSlateToMd(value);

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

// transform rules: https://github.com/syntax-tree/mdast

export default slateToMdString;
