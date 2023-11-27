import { CODE_BLOCK } from '../../constants/element-types';
import CodeBlockMenu from './menu';
import withCodeBlock from './plugin';
import renderCodeBlock, { renderCodeLine } from './render-elem';

const CodeBlockPlugin = {
  type: CODE_BLOCK,
  nodeType: 'element',
  editorMenus: [CodeBlockMenu],
  editorPlugin: withCodeBlock,
  renderElements: [renderCodeBlock, renderCodeLine],
};

export default CodeBlockPlugin;
