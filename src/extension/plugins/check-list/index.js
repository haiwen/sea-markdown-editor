import { CHECK_LIST_ITEM } from '../../constants/element-types';
import CheckListMenu from './menu';
import renderCheckListItem from './render-elem';

const CheckListPlugin = {
  type: CHECK_LIST_ITEM,
  nodeType: 'element',
  editorMenus: [CheckListMenu],
  editorPlugin: null,
  renderElements: [renderCheckListItem],
};

export default CheckListPlugin;
