import { CODE_BLOCK } from '../../constants/element-types';
import CodeBlockMenu from './menu';
import renderCodeBlock from './render-elem';

const CodeBlockPlugin = {
  type: CODE_BLOCK,
  nodeType: 'element',
  editorMenus: [CodeBlockMenu],
  editorPlugin: null,
  renderElements: [renderCodeBlock],
};

export default CodeBlockPlugin;
