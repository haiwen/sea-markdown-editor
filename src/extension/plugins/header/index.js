import { ELementTypes } from '../../constants';
import { renderHeader } from './render-elem';
import withHeader from './plugin';

const HeaderPlugin = {
  type: ELementTypes.HEADER,
  nodeType: 'element',
  editorMenus: [],
  editorPlugin: withHeader,
  renderElements: {renderHeader},
};

export default HeaderPlugin;
