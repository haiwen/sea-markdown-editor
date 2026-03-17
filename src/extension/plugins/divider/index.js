import { DIVIDER } from '../../constants/element-types';
import withDivider from './plugin';
import renderDivider from './render-elem';

const DividerPlugin = {
  type: DIVIDER,
  nodeType: 'element',
  editorPlugin: withDivider,
  renderElements: [renderDivider],
};

export default DividerPlugin;