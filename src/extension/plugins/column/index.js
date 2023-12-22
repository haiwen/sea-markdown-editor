import { COLUMN } from '../../constants/element-types';
import ColumnMenu from './menu';
import withColumn from './plugin';
import renderColumn from './render-elem';

const ColumnPlugin = {
  type: COLUMN,
  nodeType: 'element',
  editorMenus: [ColumnMenu],
  editorPlugin: withColumn,
  renderElements: [renderColumn],
};

export default ColumnPlugin;
