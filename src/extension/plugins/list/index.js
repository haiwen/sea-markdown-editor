import { LIST_ITEM } from '../../constants/element-types';
import ListMenu from './menu';

const LinkPlugin = {
  type: LIST_ITEM,
  nodeType: 'element',
  editorMenus: [ListMenu],
  editorPlugin: null,
  renderElements: [],
};

export default LinkPlugin;
