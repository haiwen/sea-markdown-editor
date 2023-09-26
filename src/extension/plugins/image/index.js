import withImages from './plugin';
import { IMAGE } from '../../constants/element-types';
import ImageMenu from './menu';
import renderImage from './render-element';

const ImagePlugin = {
  type: IMAGE,
  nodeType: 'element',
  editorMenus: [ImageMenu],
  editorPlugin: withImages,
  renderElements:[renderImage],
};

export default ImagePlugin;
