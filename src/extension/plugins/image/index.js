import withImages from './plugin';
import { IMAGE } from '../../constants/element-types';
import ImageMenu from './menu';
<<<<<<< HEAD
import renderImage from './render-element';
=======
import renderImage from './render-element/render-elem';
>>>>>>> 8397516 (feat: image-plugin)

const ImagePlugin = {
  type: IMAGE,
  nodeType: 'element',
  editorMenus: [ImageMenu],
  editorPlugin: withImages,
  renderElements:[renderImage],
};

export default ImagePlugin;
