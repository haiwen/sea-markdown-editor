import { Editor, Range, Transforms } from 'slate';
import isHotKey from 'is-hotkey';
import { jumpOutTableInEditor, getSelectedTableCells, getTableFocusingInfos, isInTable, pasteContentIntoTable, selectCellByGrid } from './helper';
import { INSERT_POSITION } from '../../constants';
import setEventTransfer from '../../../containers/custom/set-event-transfer';
import { TABLE_CELL } from '../../constants/element-types';
import { insertRow } from './table-operations';
import getEventTransfer from '../../../containers/custom/get-event-transfer';

/**
 * @param {Editor} editor
 */
const withTable = (editor) => {
  const { insertBreak, deleteBackward, onHotKeyDown, insertText, deleteForward, onCopy, insertData } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    const isTableActive = isInTable(newEditor);
    if (!isTableActive) return insertBreak && insertBreak();
    insertRow(newEditor);
    Transforms.collapse(newEditor, { edge: 'end' });
    Transforms.select(newEditor, editor.selection);
    return;
  };

  newEditor.insertText = (text) => {
    const isTableActive = isInTable(newEditor);
    if (!isTableActive) return insertText && insertText(text);
    const { selection } = newEditor;
    // set element by markdown shortcut;
    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      insertText(text);
      return;
    }
    return insertText(text);
  };

  newEditor.insertData = (data) => {
    const isTableActive = isInTable(newEditor);
    if (!isTableActive) return insertData && insertData(data);
    const { type } = getEventTransfer(data);
    if (type === 'file') {
      return insertData(data);
    }
    return pasteContentIntoTable(newEditor, data);

  };

  newEditor.deleteBackward = (unit) => {
    const isTableActive = isInTable(newEditor);
    if (!isTableActive) return deleteBackward(unit);
    const { selection } = newEditor;
    // If select range,prevent to delete
    if (!Range.isRange(selection)) return;
    const [tableCellEntry] = Editor.nodes(editor, {
      match: node => node.type === TABLE_CELL,
      mode: 'lowest'
    });
    // If delete empty cell,prevent to delete
    const isStartOfCellText = Editor.isStart(newEditor, selection.anchor, tableCellEntry[1]);
    if (isStartOfCellText) return;
    return deleteBackward && deleteBackward(unit);
  };

  newEditor.deleteForward = (unit) => {
    const isTableActive = isInTable(newEditor);
    if (!isTableActive) return deleteForward(unit);
    const { selection } = newEditor;
    // If select range,prevent to delete
    if (!Range.isRange(selection)) return;
    const [tableCellEntry] = Editor.nodes(editor, {
      match: node => node.type === TABLE_CELL,
      mode: 'lowest'
    });
    // If delete empty cell,prevent to delete
    const isEndOfCellText = Editor.isEnd(newEditor, selection.anchor, tableCellEntry[1]);
    if (isEndOfCellText) return;
    return deleteForward(unit);
  };

  newEditor.onHotKeyDown = (event) => {
    if (!isInTable(newEditor)) return onHotKeyDown && onHotKeyDown(event);

    if (isHotKey('tab', event)) {
      event.preventDefault();
      const {
        tableEntry: [tableNode],
        rowEntry: [rowNode],
        columnIndex,
        rowIndex
      } = getTableFocusingInfos(newEditor);
      let nextColumnIndex; let nextRowIndex;
      // If focus not at end of columns
      if (columnIndex < rowNode.children.length - 1) {
        nextColumnIndex = columnIndex + 1;
        nextRowIndex = rowIndex;
      } else {
        // If focus not at end of rows,add new row
        const shouldAddNewRow = rowIndex === tableNode.children.length - 1;
        nextColumnIndex = 0;
        nextRowIndex = rowIndex + 1;
        shouldAddNewRow && insertRow(newEditor, INSERT_POSITION.AFTER);
      }
      selectCellByGrid(newEditor, nextRowIndex, nextColumnIndex);
      return true;
    }

    if (isHotKey('shift+tab', event)) {
      event.preventDefault();
      const {
        rowEntry: [rowNode],
        columnIndex,
        rowIndex
      } = getTableFocusingInfos(newEditor);
      let previousColumnIndex; let previousRowIndex;
      // If focus not at start of columns
      if (columnIndex > 0) {
        previousRowIndex = rowIndex;
        previousColumnIndex = columnIndex - 1;
      } else {
        // If focus not at start of rows
        if (rowIndex > 0) {
          previousRowIndex = rowIndex - 1;
          previousColumnIndex = rowNode.children.length - 1;
        } else {
          previousRowIndex = 0;
          previousColumnIndex = 0;
        }
      }
      selectCellByGrid(newEditor, previousRowIndex, previousColumnIndex);
      return true;
    }

    if (isHotKey('mod+enter', event)) {
      event.preventDefault();
      jumpOutTableInEditor(newEditor);
      return true;
    }

    return onHotKeyDown && onHotKeyDown(event);
  };

  newEditor.onCopy = (event) => {
    if (!isInTable(newEditor)) {
      return onCopy && onCopy(event);
    }
    event.preventDefault();
    event.stopPropagation();
    const tableNode = getSelectedTableCells(newEditor);
    if (tableNode) {
      setEventTransfer(event, 'fragment', tableNode);
      return true;
    }
  };

  return newEditor;
};

export default withTable;
