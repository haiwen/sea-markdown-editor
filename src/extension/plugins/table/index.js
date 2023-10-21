import { TABLE } from '../../constants/element-types';
import TableMenu from './menu';

const TablePlugin = {
  type: TABLE,
  nodeType: 'element',
  editorMenus: [TableMenu],
  editorPlugin: null,
  renderElements: [],
};

export default TablePlugin;
