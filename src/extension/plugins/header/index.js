import { ELementTypes } from '../../constants';
import { renderHeader } from './render-elem';
import withHeader from './plugin';
import HeaderMenu from './menu';

const HeaderPlugin = {
  type: ELementTypes.HEADER,
  nodeType: 'element',
  editorMenus: [HeaderMenu],
  editorPlugin: withHeader,
  renderElements: [renderHeader],
};

export default HeaderPlugin;
