import TextStyleMenu from './menu';
import withTextStyle from './plugin';
import renderText from './render-elem';

const TextPlugin = {
  type: 'text',
  editorMenus: [TextStyleMenu],
  editorPlugin: withTextStyle,
  renderElements: [renderText]
};

export default TextPlugin;
