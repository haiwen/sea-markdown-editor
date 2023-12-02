import { Editor, Transforms } from 'slate';
import slugid from 'slugid';
import { getNodeType, getSelectedElems } from '../../core/queries';
import { focusEditor } from '../../core/transforms/focus-editor';
import { ELementTypes } from '../../constants';
import { FORMULA } from '../../constants/element-types';
import { generateDefaultText } from '../../core';

export const isMenuDisabled = (editor, readonly = false) => {
  if (readonly) return true;
  const { selection } = editor;
  if (!selection) return false;
  const selectedElems = getSelectedElems(editor);
  // Check if the selected element is illegal
  const isSelectedIllegalElement = selectedElems.some(elem => {
    const { type } = elem;
    if (editor.isVoid(elem)) return true;
    const unSupportTypes = [
      ELementTypes.CODE_BLOCK,
      ELementTypes.CODE_LINE,
      ELementTypes.TABLE,
      ELementTypes.TABLE_CELL,
      ELementTypes.TABLE_ROW,
      ELementTypes.HEADER1,
      ELementTypes.HEADER2,
      ELementTypes.HEADER3,
      ELementTypes.HEADER4,
      ELementTypes.HEADER5,
      ELementTypes.HEADER6,
      ELementTypes.LIST_ITEM,
      ELementTypes.UNORDERED_LIST,
      ELementTypes.ORDERED_LIST,
    ];
    if (unSupportTypes.includes(type)) return true;
    return false;
  });
  if (isSelectedIllegalElement) return true;
  return false;
};

export const isFormulaActive = (editor) => {
  return isFormulaType(editor);
};

export const isFormulaType = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => getNodeType(n) === ELementTypes.FORMULA,
    universal: true,
  });
  return !!match;
};

export const insertFormula = (editor, data) => {
  const formula = {
    id: slugid.nice(),
    type: FORMULA,
    data: { formula: data.formula },
    children: [generateDefaultText()],
  };
  Transforms.insertNodes(editor, formula, { at: data.at, void: true });
  focusEditor(editor);
};

export const updateFormula = (editor, data) => {
  const { formula, at } = data;
  Transforms.setNodes(editor, { data: { formula } }, { at: at, void: true });
  focusEditor(editor);
};
