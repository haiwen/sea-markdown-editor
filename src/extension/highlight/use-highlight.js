import { Element } from 'slate';
import { CODE_LINE } from '../constants/element-types';

export const useHighlight = (editor) => ([node, path]) => {
  let ranges = [];
  if (Element.isElement(node) && node.type === CODE_LINE) {
    ranges = editor?.nodeToDecorations?.get(node) || [];
    return ranges;
  }
  return ranges;
};

export default useHighlight;
