import { TABLE } from '../../constants/element-types';
import TableMenu from './menu';
import { AlignmentDropDown, ColumnOperationDropDownList, RowOperationDropDownList, RmoveTableMenu } from './menu/table-operator';
import withTable from './plugin';
import RenderTableContainer, { RenderTableCell, RenderTableRow } from './render-elem';

const TablePlugin = {
  type: TABLE,
  nodeType: 'element',
  editorMenus: [TableMenu, AlignmentDropDown, ColumnOperationDropDownList, RowOperationDropDownList, RmoveTableMenu],
  editorPlugin: withTable,
  renderElements: [RenderTableCell, RenderTableRow, RenderTableContainer],
};

export default TablePlugin;
