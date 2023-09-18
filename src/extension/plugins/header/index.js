import { ELementTypes } from "../../constants";
import { renderHeader, renderSubtitle, renderTitle } from "./render-elem";
import withHeader from './plugin'

const HeaderPlugin = {
  type: ELementTypes.HEADER,
  nodeType: 'element',
  editorMenus: [],
  editorPlugin: withHeader,
  renderElements: { renderSubtitle, renderTitle, renderHeader },
};

export default HeaderPlugin;
