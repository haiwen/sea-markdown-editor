import { LINK } from '../../constants/element-types';
import LinkMenu from './menu';
import withLink from './plugin';
import renderLink from './render-elem';

const LinkPlugin = {
  type: LINK,
  nodeType: 'element',
  editorMenus: [LinkMenu],
  editorPlugin: withLink,
  renderElements: [renderLink],
};

export default LinkPlugin;
