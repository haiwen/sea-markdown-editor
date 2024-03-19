import { Editor, Node, Path, Range, Transforms, insertFragment } from 'slate';
import { ReactEditor } from 'slate-react';
import isUrl from 'is-url';
import { generateTable, generateTableRow } from './model';
import { BLOCKQUOTE, CODE_BLOCK, COLUMN, FORMULA, LIST_ITEM, ORDERED_LIST, PARAGRAPH, TABLE, TABLE_CELL, TABLE_ROW, UNORDERED_LIST } from '../../constants/element-types';
import { focusEditor, generateElement, getSelectedElems } from '../../core';
import getEventTransfer from '../../../containers/custom/get-event-transfer';
import { htmlDeserializer } from '../../../utils/deserialize-html';
import { isImage } from '../../../utils/common';
import { generateLinkNode } from '../link/helper';
import { insertImage } from '../image/helper';

export const isDisabled = (editor, readonly) => {
  const { selection } = editor;
  if (readonly || !selection) return true;
  const disableTypes = [
    TABLE,
    TABLE_ROW,
    TABLE_CELL,
    FORMULA,
    CODE_BLOCK,
    COLUMN,
    BLOCKQUOTE,
    UNORDERED_LIST,
    ORDERED_LIST,
    LIST_ITEM,
  ];
  const [nodeEntry] = Editor.nodes(editor, {
    match: n => disableTypes.includes(n.type),
    mode: 'highest'
  });
  if (nodeEntry) return true;
  return false;
};

export const isInTable = (editor) => {
  const { selection } = editor;
  if (!selection) return false;
  const [nodeEntry] = getTableEntry(editor);
  if (!nodeEntry) return false;
  return true;
};

export const insertTable = (editor, rowNum, columnNum) => {
  const table = generateTable({ rowNum, columnNum });
  const { selection } = editor;

  Editor.insertNode(editor, table, { select: false });

  if (Range.isCollapsed(selection)) {
    const [paragraphNodeEntry] = Editor.nodes(
      editor,
      {
        at: selection.anchor.path,
        match: n => n.type === PARAGRAPH && Node.string(n).length === 0,
      }
    );
    if (paragraphNodeEntry) {
      const paragraphPath = paragraphNodeEntry[1];
      if (paragraphPath.length === 1 && paragraphPath[0] !== 0) {
        Transforms.removeNodes(editor, { at: paragraphPath });
      }
    }
  }

  // Auto focus at the first cell in table
  const [nodeEntry] = Editor.nodes(editor, {
    match: node => node.id === table.id,
    mode: 'highest'
  });
  const focusPoint = Editor.start(editor, nodeEntry[1]);
  focusEditor(editor, focusPoint);
};

export const getTableFocusingInfos = (editor) => {
  if (!isInTable(editor)) return null;
  const nodeEntries = Editor.nodes(editor, {
    match: n => [TABLE, TABLE_ROW, TABLE_CELL].includes(n.type),
  });
  const nodeEntryList = Array.from(nodeEntries);
  const [tableEntry, rowEntry, cellEntry] = nodeEntryList;
  const columnIndex = cellEntry[1].at(-1);
  const rowIndex = cellEntry[1].at(-2);
  return { cellEntry, tableEntry, rowEntry, columnIndex, rowIndex };
};

export const selectCellByGrid = (editor, rowIndex, colIndex) => {
  const { tableEntry: [, tablePath] } = getTableFocusingInfos(editor);
  const selectRange = Editor.range(editor, tablePath.concat(rowIndex, colIndex));
  focusEditor(editor, selectRange);
};

export const getSelectedTableCells = (editor) => {
  const [tableEntry] = getTableEntry(editor);
  if (!tableEntry) return [];

  const [tableNode] = tableEntry;
  const tableRows = tableNode.children;
  const selectGrid = getSelectGrid(editor);

  const { startRowIndex, endRowIndex, startColIndex, endColIndex } = selectGrid;

  const selectedTableRows = [];
  for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
    const currentRow = tableRows[rowIndex];
    let selectedTableCells = [];
    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
      const currentCell = currentRow.children[colIndex];
      selectedTableCells.push(currentCell);
    }

    selectedTableRows.push(generateTableRow({ childrenOrText: selectedTableCells }));
    selectedTableCells = [];
  }

  return [generateTable({ childrenOrText: selectedTableRows })];
};

export const getSelectGrid = (editor) => {
  const [tableEntry] = getTableEntry(editor);
  if (!tableEntry) return null;

  const selectedTableCells = document.querySelectorAll('.selected-cell');
  if (selectedTableCells.length === 0) return null;
  const node = ReactEditor.toSlateNode(editor, selectedTableCells[0]);
  const nodePath = ReactEditor.findPath(editor, node);
  if (!Path.isAncestor(tableEntry[1], nodePath)) return null;

  const selectGrid = Array.from(selectedTableCells).reduce((grid, cell) => {
    const { startRowIndex, endRowIndex, startColIndex, endColIndex } = grid;
    const { cellIndex: colIndex } = cell;
    const { rowIndex } = cell.parentNode;
    if (endRowIndex === -1 || rowIndex > endRowIndex) grid.endRowIndex = rowIndex;
    if (startRowIndex === -1 || rowIndex < startRowIndex) grid.startRowIndex = rowIndex;
    if (endColIndex === -1 || colIndex > endColIndex) grid.endColIndex = colIndex;
    if (startColIndex === -1 || colIndex < startColIndex) grid.startColIndex = colIndex;
    return { ...grid };
  }, { startRowIndex: -1, endRowIndex: -1, startColIndex: -1, endColIndex: -1 });

  return selectGrid;
};

export const pasteContentIntoTable = (editor, content) => {
  const data = content;
  let { fragment, text, type, html } = getEventTransfer(data);
  const newText = text.replace(/\r\n|\n/g, ' ');

  if (!fragment && type === 'text') {
    if (isUrl(text) && !isImage(text)) {
      const link = generateLinkNode(text, text);
      Editor.insertFragment(editor, [link], { select: true });
      return;
    } else if (isUrl(text) && isImage(text)) {
      insertImage(editor, text);
      return;
    }
    Transforms.insertText(editor, newText);
    return;
  }

  if (type === 'html') {
    fragment = htmlDeserializer(html);
  }

  if (fragment.length === 1) {
    if (fragment[0].type === TABLE) {
      const clipboardTable = fragment[0];
      const {
        tableEntry: [tableNode, tablePath],
        rowEntry: [rowNode],
        rowIndex,
        columnIndex
      } = getTableFocusingInfos(editor);
      const tableWidth = rowNode.children.length;
      const tableHeight = tableNode.children.length;
      clipboardTable.children.some((clipRow, clipRowIndex) => {
        const currentInsertPath = tablePath.concat(rowIndex + clipRowIndex + rowIndex);
        // Out of table
        if (rowIndex + clipRowIndex >= tableHeight + 1) return true;
        clipRow.children.some((clipCol, clipColIndex) => {
          // Out of table
          if (columnIndex + clipColIndex >= tableWidth + 1) return true;
          const currentCellPath = currentInsertPath.concat(columnIndex + clipColIndex);
          const currentCellChildPath = currentCellPath.concat(0);
          Transforms.removeNodes(editor, { at: currentCellChildPath });
          if (clipCol.children.type !== PARAGRAPH) {
            const text = Node.string(clipCol);
            const newChild = generateElement(PARAGRAPH, { childrenOrText: text });
            Transforms.insertNodes(editor, newChild, { at: currentCellChildPath });
          } else {
            Transforms.insertNodes(editor, clipCol.children, { at: currentCellChildPath });
          }
          return false;
        });
        return false;
      });
    } else if (fragment[0].type === PARAGRAPH) {
      insertFragment(editor, fragment);
    } else {
      Transforms.insertText(editor, text.replace(/\r\n|\n/g, ' '));
    }
  }
};

export const jumpOutTableInEditor = (editor) => {
  const [tableEntry] = getTableEntry(editor);
  if (!tableEntry) return;

  const [, tablePath] = tableEntry;
  const tableParentPath = Path.parent(tablePath);
  const insertPath = tableParentPath.concat(tablePath.at(-1) + 1);
  Transforms.insertNodes(editor, generateElement(PARAGRAPH), { at: insertPath });
  Transforms.select(editor, { path: insertPath.concat(0), offset: 0 });
};

export const getTableEntry = (editor) => {
  return Editor.nodes(editor, {
    match: n => n.type === TABLE,
    mode: 'highest'
  });
};

export const isSelectingMultipleTables = (editor) => {
  let selectedTableCount = 0;
  const selectedElems = getSelectedElems(editor);
  const isSelectedMultiple = selectedElems.some(elem => {
    if (elem.type === TABLE) selectedTableCount++;
    if (selectedTableCount > 1) return true;
    return false;
  });
  return isSelectedMultiple;
};
