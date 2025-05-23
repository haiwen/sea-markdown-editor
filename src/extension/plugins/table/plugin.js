import { Editor, Element, Node, Path, Range, Transforms, unwrapNodes } from 'slate';
import isHotKey from 'is-hotkey';
import { jumpOutTableInEditor, getSelectedTableCells, getTableFocusingInfos, isInTable, pasteContentIntoTable, selectCellByGrid, getSelectGrid, getTableEntry } from './helper';
import { HEADERS, INSERT_POSITION } from '../../constants';
import setEventTransfer from '../../../containers/custom/set-event-transfer';
import { BLOCKQUOTE, CHECK_LIST_ITEM, CODE_BLOCK, ORDERED_LIST, PARAGRAPH, TABLE, TABLE_CELL, TABLE_ROW, UNORDERED_LIST } from '../../constants/element-types';
import { insertRow } from './table-operations';
import getEventTransfer from '../../../containers/custom/get-event-transfer';
import EventBus from '../../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../../constants/event-types';
import { generateEmptyElement, getSelectedNodeByType, getSelectedNodeEntryByType, isFirstNode, isLastNode } from '../../core';

/**
 * @param {Editor} editor
 */
const withTable = (editor) => {
  const { insertBreak, deleteBackward, onHotKeyDown, insertText, deleteForward, onCopy, insertData, insertFragment, normalizeNode } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    const isTableActive = isInTable(newEditor);
    if (!editor.selection || !isTableActive) return insertBreak && insertBreak();
    insertRow(newEditor);
    const [nodeEntry] = Editor.nodes(newEditor, { match: n => Element.isElement(n) && n.type === TABLE_ROW });
    const path = Path.next(nodeEntry[1]);
    const firstCellPath = path.concat(0);
    Transforms.select(newEditor, firstCellPath);
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

  newEditor.insertFragment = (fragment) => {
    const isTableActive = isInTable(newEditor);
    if (!isTableActive) return insertFragment && insertFragment(fragment);

    if (!Array.isArray(fragment)) return;
    const firstChild = fragment[0];
    if (fragment.length === 1 && firstChild.type === TABLE) {
      const { tableEntry, rowEntry } = getTableFocusingInfos(editor);
      let selectedInfo = getSelectGrid(editor);
      if (!selectedInfo) {
        const tableCellEntry = getSelectedNodeEntryByType(editor, TABLE_CELL);
        if (!tableCellEntry) return;
        const [, path] = tableCellEntry;
        const startColIndex = path.pop();
        const startRowIndex = path.pop();
        selectedInfo = { startRowIndex, startColIndex };
      }
      const { startRowIndex, startColIndex } = selectedInfo;
      const [tableNode, tablePath] = tableEntry;
      const [rowNode] = rowEntry;
      const tableWidth = rowNode.children.length;
      const tableHeight = tableNode.children.length;
      firstChild.children.forEach((clipRow, clipRowIndex) => {
        // Out of table
        if (startRowIndex + clipRowIndex >= tableHeight) return true;

        // rowPath = [...tablePath, rowIndex + clipRowIndex];
        const currentRowPath = [...tablePath, startRowIndex + clipRowIndex];
        clipRow.children.forEach((clipCol, clipColIndex) => {
          // Out of table
          if (startColIndex + clipColIndex >= tableWidth) return true;

          // cellPath = [...rowPath, columnIndex + clipColIndex];
          const currentCellPath = [...currentRowPath, startColIndex + clipColIndex];
          const currentCellChildPath = currentCellPath.concat(0);
          Transforms.removeNodes(editor, { at: currentCellChildPath });

          const otherBlockTypes = [...HEADERS, CHECK_LIST_ITEM, PARAGRAPH];
          const newChildren = clipCol.children.map(item => {
            if (otherBlockTypes.includes(item.type)) return item.children;
            return item;
          }).flat();

          Transforms.insertNodes(editor, newChildren, { at: currentCellChildPath });

          return false;
        });
        return false;
      });
      return;
    }

    const notSupportTypes = [TABLE, BLOCKQUOTE, UNORDERED_LIST, ORDERED_LIST, CODE_BLOCK];
    const isDataValid = fragment.some(item => notSupportTypes.includes(item.type));
    if (isDataValid) {
      const strContent = fragment.reduce((ret, item) => {
        return ret + Node.string(item);
      }, '');
      Editor.insertText(newEditor, strContent);
      return;
    }
    const otherBlockTypes = [...HEADERS, CHECK_LIST_ITEM, PARAGRAPH];

    const newChildren = fragment.map(item => {
      if (otherBlockTypes.includes(item.type)) return item.children;
      return item;
    }).flat();
    insertFragment(newChildren);
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
      if (newEditor.hasMovedSelection) event.stopPropagation();
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
      if (newEditor.hasMovedSelection) event.stopPropagation();
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

    if (isHotKey('mod+enter', event) || isHotKey('shift+enter', event)) {
      event.preventDefault();
      jumpOutTableInEditor(newEditor);
      return true;
    }

    if (isHotKey('mod+a', event)) {
      event.preventDefault();
      const {
        tableEntry: [tableNode],
        rowEntry: [rowNode],
      } = getTableFocusingInfos(newEditor);
      const rowCount = tableNode.children.length;
      const colCount = rowNode.children.length;
      selectCellByGrid(newEditor, rowCount - 1, colCount - 1);
      const eventBus = EventBus.getInstance();
      eventBus.dispatch(INTERNAL_EVENTS.ON_SELECT_ALL_CELL, tableNode.id);

      return true;
    }

    if (isHotKey('delete', event) || isHotKey('backspace', event)) {
      const selectedInfo = getSelectGrid(newEditor);

      if (!selectedInfo) return onHotKeyDown && onHotKeyDown(event);

      const { startRowIndex, endRowIndex, startColIndex, endColIndex } = selectedInfo;

      if (startRowIndex === -1 || endRowIndex === -1 || startColIndex === -1 || endColIndex === -1) return;

      const [tableEntry] = getTableEntry(newEditor);
      const [, tablePath] = tableEntry;

      for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
        for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
          Transforms.insertText(newEditor, '', { at: tablePath.concat(rowIndex, colIndex) });
        }
      }
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
    // selected multiple cells
    const tableNode = getSelectedTableCells(newEditor);
    if (tableNode) {
      setEventTransfer(event, 'fragment', tableNode);
      return true;
    }
    // selected only one cell
    const tableCell = getSelectedNodeByType(newEditor, TABLE_CELL);
    if (tableCell) {
      const selection = window.getSelection();
      const selectedText = selection.toString();
      const range = selection.getRangeAt(0);
      const selectedContent = range.cloneContents();
      const div = document.createElement('div');
      // Unwrap image wrapper
      selectedContent.childNodes.forEach(node => {
        if (node.classList && node.classList.contains('sf-image-wrapper')) {
          const img = node.querySelector('img');
          div.appendChild(img.cloneNode(true));
          return;
        }
        div.appendChild(node.cloneNode(true));
      });
      setEventTransfer(event, 'text', selectedText);
      setEventTransfer(event, 'html', div.innerHTML.toString());
      return true;
    }
    return false;
  };

  newEditor.normalizeNode = ([node, path]) => {
    if (node.type === TABLE) {
      const isLast = isLastNode(newEditor, node);
      if (isLast) {
        const paragraph = generateEmptyElement(PARAGRAPH);
        Transforms.insertNodes(newEditor, paragraph, { at: [path[0] + 1] });
      }
      const isFirst = isFirstNode(newEditor, node);
      if (isFirst) {
        const paragraph = generateEmptyElement(PARAGRAPH);
        Transforms.insertNodes(newEditor, paragraph, { at: [path[0]] });
      }
    }

    if (node.type === TABLE_ROW) {
      const parentEntry = Editor.parent(editor, path);

      if (parentEntry?.[0].type !== TABLE) {
        unwrapNodes(editor, {
          at: path,
        });
        return;
      }
    }

    if (node.type === TABLE_CELL) {
      const parentEntry = Editor.parent(editor, path);

      if (parentEntry?.[0].type !== TABLE_ROW) {
        unwrapNodes(editor, {
          at: path,
        });
        return;
      }
    }
    return normalizeNode([node, path]);
  };

  return newEditor;
};

export default withTable;
