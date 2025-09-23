import { LINK_REFERENCE } from '../../constants/element-types';
import renderLinkReference from './render-elem';

const LinkReferencePlugin = {
  type: LINK_REFERENCE,
  nodeType: 'element',
  // editorMenus: [],
  // editorPlugin: withLink,
  renderElements: [renderLinkReference],
};

export default LinkReferencePlugin;
