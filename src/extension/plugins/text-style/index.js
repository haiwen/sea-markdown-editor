import TextStyleMenu from './menu';
import renderText from './render-elem';

const TextPlugin = {
  type: 'text',
  editorMenus:[TextStyleMenu],
  editorPlugin: null,
  renderElements: [renderText]
};

export default TextPlugin;
