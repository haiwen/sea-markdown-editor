import withImages from './plugin';
import { IMAGE } from '../../constants/element-types';
import renderImage from './render-elem';

const ImagePlugin = {
  type: IMAGE,
  nodeType: 'element',
  editorMenus: [],
  editorPlugin: withImages,
  renderElements: { renderImage },
};

export default ImagePlugin;
