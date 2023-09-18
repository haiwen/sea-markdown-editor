import { HEADER } from "../../constants/element-types";
import { renderHeader, renderSubtitle, renderTitle } from "./render-elem";
import withHeader from './plugin'

const HeaderPlugin = {
  type: HEADER,
  nodeType: 'element',
  editorMenus: [],
  editorPlugin: withHeader,
  renderElements: {renderSubtitle,renderTitle,renderHeader},
};

export default HeaderPlugin;
