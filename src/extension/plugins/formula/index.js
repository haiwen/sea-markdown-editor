import { FORMULA } from '../../constants/element-types';
import FormulaMenu from './menu';
import withFormula from './plugin';
import renderFormula from './render-elem';

const FormulaPlugin = {
  type: FORMULA,
  nodeType: 'element',
  editorMenus: [FormulaMenu],
  editorPlugin: withFormula,
  renderElements: [renderFormula],
};

export default FormulaPlugin;
