import { Editor, Node, Path, Range, Transforms, insertFragment } from 'slate';
import { ReactEditor } from 'slate-react';
import isUrl from 'is-url';
import { generateTable, generateTableCell, generateTableRow } from './model';
import { BLOCKQUOTE, CODE_BLOCK, COLUMN, FORMULA, LIST_ITEM, ORDERED_LIST, PARAGRAPH, TABLE, TABLE_CELL, TABLE_ROW, UNORDERED_LIST } from '../../constants/element-types';
import { findPath, focusEditor, generateElement, getSelectedElems, getSelectedNodeByType } from '../../core';
import getEventTransfer from '../../../containers/custom/get-event-transfer';
import { htmlDeserializer } from '../../../utils/deserialize-html';
import { isImage } from '../../../utils/common';
import { generateLinkNode } from '../link/helper';
import { insertImage } from '../image/helper';
import { EMPTY_SELECTED_RANGE } from './constant';

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
  if (!tableEntry) return null;

  const [tableNode] = tableEntry;
  const tableRows = tableNode.children;
  const selectGrid = getSelectGrid(editor);
  if (!selectGrid) return null;

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

export const getContextMenuPosition = (event, tableRef) => {
  const menuHeight = 240;
  const menuWidth = 350;
  const { clientHeight, clientWidth } = document.body; // page
  const { x, y } = tableRef.current.getBoundingClientRect(); // table
  const { clientY, clientX } = event; // cursor

  const isBeyondBottom = clientY + menuHeight > clientHeight;
  const isBeyondRight = clientX + menuWidth > clientWidth;

  const defaultTop = clientY - y;
  const defaultLeft = clientX - x;

  let top = 0;
  let left = 0;
  if (isBeyondBottom) {
    const hiddenHeight = menuHeight - (clientHeight - clientY);
    top = defaultTop - hiddenHeight;
  }

  if (isBeyondRight) {
    const hiddenWidth = menuWidth - (clientWidth - clientX);
    left = defaultLeft - hiddenWidth;
  }

  if (!isBeyondBottom && !isBeyondRight) {
    return { top: defaultTop, left: defaultLeft };
  }

  if (isBeyondBottom && isBeyondRight) {
    return { top, left };
  }

  if (isBeyondBottom) {
    return {
      top,
      left: defaultLeft,
    };
  }

  return {
    top: defaultTop,
    left,
  };

};

export const getSelectedInfo = (editor) => {
  const currentTable = getSelectedNodeByType(editor, TABLE);
  const currentRow = getSelectedNodeByType(editor, TABLE_ROW);
  const currentCell = getSelectedNodeByType(editor, TABLE_CELL);
  const currentCellPath = findPath(editor, currentCell);
  return {
    table: currentTable,
    tablePath: findPath(editor, currentTable),
    tableSize: [currentTable.children.length, currentRow.children.length],
    row: currentRow,
    rowPath: findPath(editor, currentRow),
    rowIndex: currentCellPath[currentCellPath.length - 2],
    cell: currentCell,
    cellPath: findPath(editor, currentCell),
    cellIndex: currentCellPath[currentCellPath.length - 1],
  };
};

export const combineCells = (editor) => {
  const { tablePath } = getSelectedInfo(editor);
  const { minColIndex, maxColIndex, minRowIndex, maxRowIndex } = editor.tableSelectedRange;
  const rowspan = maxRowIndex - minRowIndex + 1;
  const colspan = maxColIndex - minColIndex + 1;

  if (rowspan === 1 && colspan === 1) return;

  Editor.withoutNormalizing(editor, () => {
    let mergedChildren = [];

    for (let r = minRowIndex; r <= maxRowIndex; r++) {
      for (let c = minColIndex; c <= maxColIndex; c++) {
        const cellPath = [...tablePath, r, c];
        const [cellNode] = Editor.node(editor, cellPath);
        if (cellNode.is_combined) continue;

        mergedChildren = mergedChildren.concat(cellNode.children);

        if (!(r === minRowIndex && c === minColIndex)) {
          Transforms.setNodes(editor, { 'is_combined': true }, { at: cellPath });
        }
      }
    }
    const masterPath = [...tablePath, minRowIndex, minColIndex];

    Transforms.setNodes(editor, { rowspan, colspan }, { at: masterPath });

    Transforms.removeNodes(editor, { at: [...masterPath, 0] });
    Transforms.insertNodes(editor, mergedChildren, { at: [...masterPath, 0] });
    focusEditor(editor, masterPath);
  });
};

export const splitCell = (editor, rowNumber, columnNumber) => {
  if (rowNumber === 1 && columnNumber === 1) {
    return;
  }

  const { cell, rowIndex, cellIndex, cellPath, tablePath } = getSelectedInfo(editor);

  const { rowspan, colspan } = cell;
  const rowspanBase = Math.floor(rowspan / rowNumber);
  const rowspanLeft = rowspan % rowNumber;
  const colspanBase = Math.floor(colspan / columnNumber);
  const colspanLeft = colspan % columnNumber;
  const cellNumber = rowNumber * columnNumber;
  const dataBlockNumber = Math.ceil(cell.children.length / cellNumber);

  let firstNewCell;
  let rowspanSum = 0;
  for (let i = 0; i < rowNumber; i++) {
    let newRowSpan = rowspanBase + ((i + 1) <= rowspanLeft ? 1 : 0);
    let colspanSum = 0;
    for (let j = 0; j < columnNumber; j++) {
      const newCell = generateTableCell(editor);

      let startIndex = (i * columnNumber + j) * dataBlockNumber;
      if (startIndex < cell.children.length) {
        let endIndex = Math.min(startIndex + dataBlockNumber, cell.children.length);
        newCell.children = cell.children.slice(startIndex, endIndex);
      }

      newCell.rowspan = newRowSpan;
      newCell.colspan = colspanBase + ((j + 1) <= colspanLeft ? 1 : 0);

      const newRowIndex = rowIndex + rowspanSum;
      const newCellIndex = cellIndex + colspanSum;
      const targetCellPath = [...tablePath, newRowIndex, newCellIndex];
      if (i === 0 && j === 0) {
        firstNewCell = newCell;
      } else {
        Transforms.removeNodes(editor, { at: targetCellPath });
        Transforms.insertNodes(editor, newCell, { at: targetCellPath });
      }

      colspanSum += newCell.colspan;
    }
    rowspanSum += newRowSpan;
  }

  Transforms.removeNodes(editor, { at: cellPath });
  Transforms.insertNodes(editor, firstNewCell, { at: cellPath });
};

export const setTableSelectedRange = (editor, range) => {
  if (range) {
    editor.tableSelectedRange = range;
    return;
  }
  editor.tableSelectedRange = EMPTY_SELECTED_RANGE;
};
