import withImages from './plugin';
import { IMAGE } from '../../constants/element-types';
import renderImage from './render-element.js/render-elem';
import ImageMenu from './menu';

const ImagePlugin = {
  type: IMAGE,
  nodeType: 'element',
  editorMenus: [ImageMenu],
  editorPlugin: withImages,
  renderElements: [renderImage],
};

export default ImagePlugin;
