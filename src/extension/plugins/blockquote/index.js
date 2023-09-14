import { BLOCKQUOTE } from '../../constants/element-types';
import withBlockquote from './plugin';
import renderBlockquote from './render-elem';

const BlockquotePlugin = {
  type: BLOCKQUOTE,
  nodeType: 'element',
  editorMenus: [],
  editorPlugin: withBlockquote,
  renderElements: [renderBlockquote],
};

export default BlockquotePlugin;
