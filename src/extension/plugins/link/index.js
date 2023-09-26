import { LINK } from '../../constants/element-types';
import LinkMenu from './menu';
import withLink from './plugin';

const LinkPlugin = {
  type: LINK,
  nodeType: 'element',
  editorMenus: [LinkMenu],
  editorPlugin: withLink,
  renderElements: [],
};

export default LinkPlugin;
