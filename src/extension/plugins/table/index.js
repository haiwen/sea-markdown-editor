import { TABLE } from '../../constants/element-types';
import TableMenu from './menu';
import { AlignmentDropDown, ColumnOperationDropDownList, RowOperationDropDownList, RemoveTableMenu } from './menu/table-operator';
import withTable from './plugin';
import RenderTableContainer, { RenderTableCell, RenderTableRow } from './render-elem';

const TablePlugin = {
  type: TABLE,
  nodeType: 'element',
  editorMenus: [TableMenu, AlignmentDropDown, ColumnOperationDropDownList, RowOperationDropDownList, RemoveTableMenu],
  editorPlugin: withTable,
  renderElements: [RenderTableCell, RenderTableRow, RenderTableContainer],
};

export default TablePlugin;
