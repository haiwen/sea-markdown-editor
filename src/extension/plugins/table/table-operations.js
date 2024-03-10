import { Editor, Transforms } from 'slate';
import { INSERT_POSITION, TEXT_ALIGN } from '../../constants';
import { getSelectGrid, getTableEntry, getTableFocusingInfos, isSelectingMultipleTables } from './helper';
import { generateTableCell, generateTableRow } from './model';
import { focusEditor, generateDefaultParagraph, isLastNode } from '../../core';

/**
 * @param {Object} editor
 * @param {INSERT_POSITION.AFTER | INSERT_POSITION.BEFORE} insertPosition by default is INSERT_POSITION.AFTER
 */
const insertRow = (editor, position = INSERT_POSITION.AFTER) => {
  const {
    tableEntry: [, tablePath],
    rowEntry: [rowNode],
    rowIndex,
  } = getTableFocusingInfos(editor);

  const getInsertPath = (rowIndex) => {
    const handlePosition = {
      [INSERT_POSITION.BEFORE]: (rowIndex) => tablePath.concat(rowIndex),
      [INSERT_POSITION.AFTER]: (rowIndex) => tablePath.concat(rowIndex + 1),
    };
    return handlePosition[position](rowIndex);
  };

  const insertPath = getInsertPath(rowIndex);
  const insertRowChildren = rowNode.children.map(({ align }) => generateTableCell({ align }));
  const insertRow = generateTableRow({ childrenOrText: insertRowChildren });
  Transforms.insertNodes(editor, insertRow, { at: insertPath });
};

const removeRow = (editor) => {
  const isSelectMultipleTable = isSelectingMultipleTables(editor);
  if (isSelectMultipleTable) return;

  const selectInfo = getSelectGrid(editor);
  const [tableEntry] = getTableEntry(editor);

  if (!tableEntry) return;

  if (selectInfo) {
    const { startRowIndex, endRowIndex } = selectInfo;
    const [table, tablePath] = tableEntry;
    const tableRowCount = table.children.length;

    // Remove all rows
    if (startRowIndex === 0 && endRowIndex === tableRowCount - 1) return removeTable(editor);

    for (let index = endRowIndex; index >= startRowIndex; index--) {
      const rowPath = tablePath.concat(index);
      Transforms.removeNodes(editor, { at: rowPath });
    }
    const focusPoint = Editor.start(editor, tableEntry[1].concat(startRowIndex - 1 < 0 ? 0 : startRowIndex - 1));
    focusEditor(editor, focusPoint);
    return;
  }

  const {
    tableEntry: [tableNode, tablePath],
    rowEntry: [, rowPath],
    rowIndex,
  } = getTableFocusingInfos(editor);

  let focusPoint = null;
  const tableHeight = tableNode.children.length;
  // If table has one more row, remove row, else remove table
  if (tableHeight > 1) {
    // If removing row is the last row, focus on the previous row
    const isRemovingLastRow = rowIndex === tableHeight - 1;

    focusPoint = isRemovingLastRow
      ? Editor.start(editor, tablePath.concat(rowIndex - 1))
      : Editor.start(editor, rowPath);

    Transforms.removeNodes(editor, { at: rowPath });
    focusEditor(editor, focusPoint);
  } else {
    return removeTable(editor);
  }
};

const removeTable = (editor) => {
  const [tableNodeEntry] = getTableEntry(editor);
  if (!tableNodeEntry) return;

  const [table, tablePath] = tableNodeEntry;
  const isLast = isLastNode(editor, table);

  if (isLast) {
    const paragraph = generateDefaultParagraph();
    Transforms.removeNodes(editor, { at: tablePath });
    Transforms.insertNodes(editor, paragraph, { at: tablePath });
    const focusPoint = Editor.start(editor, tablePath);
    focusEditor(editor, focusPoint);
    return;
  }

  const focusPoint = Editor.start(editor, tablePath[1]);
  Transforms.removeNodes(editor, { at: tablePath });
  focusEditor(editor, focusPoint);
};

/**
 * @param {Object} editor
 * @param {INSERT_POSITION.AFTER | INSERT_POSITION.BEFORE} insertPosition by default is INSERT_POSITION.AFTER
 */
const insertColumn = (editor, insertPosition = INSERT_POSITION.AFTER) => {
  const {
    tableEntry: [tableNode, tablePath],
    rowIndex,
    columnIndex,
  } = getTableFocusingInfos(editor);

  const getInsertPath = (rowIndex, columnIndex) => {
    const newCellPath = {
      [INSERT_POSITION.BEFORE]: (rowIndex, columnIndex) => tablePath.concat(rowIndex, columnIndex),
      [INSERT_POSITION.AFTER]: (rowIndex, columnIndex) => tablePath.concat(rowIndex, columnIndex + 1),
    };
    return newCellPath[insertPosition](rowIndex, columnIndex);
  };

  tableNode.children.forEach((row, rowIndex) => {
    const insertPath = getInsertPath(rowIndex, columnIndex);
    const newCell = generateTableCell(rowIndex, columnIndex);
    Transforms.insertNodes(editor, newCell, { at: insertPath });
  });

  const align = [...tableNode.align];
  const insertAlgin = insertPosition === INSERT_POSITION.BEFORE ? columnIndex : columnIndex + 1;
  align.splice(insertAlgin, 0, TEXT_ALIGN.LEFT);
  Transforms.setNodes(editor, { align }, { at: tablePath });

  const focusPoint = Editor.start(editor, getInsertPath(rowIndex, columnIndex));
  focusEditor(editor, focusPoint);
};

const removeColumn = (editor) => {
  const isSelectMultipleTable = isSelectingMultipleTables(editor);
  if (isSelectMultipleTable) return;

  const selectInfos = getSelectGrid(editor);
  const [tableEntry] = getTableEntry(editor);

  if (!tableEntry) return;

  if (selectInfos) {
    const { startColIndex, endColIndex } = selectInfos;
    const [table, tablePath] = tableEntry;
    const tableRowCount = table.children.length;
    const tableColumnCount = table.children[0].children.length;

    // Remove all columns
    if (startColIndex === 0 && endColIndex === tableColumnCount - 1) return removeTable(editor);

    for (let rowIndex = 0; rowIndex < tableRowCount; rowIndex++) {
      for (let colIndex = endColIndex; colIndex > startColIndex; colIndex--) {
        const cellPath = tablePath.concat(rowIndex, colIndex);
        Transforms.removeNodes(editor, { at: cellPath });
      }
    }

    const focusPoint = Editor.start(editor, tablePath.concat(0, startColIndex - 1 < 0 ? 0 : startColIndex - 1));
    focusEditor(editor, focusPoint);
  }

  const {
    tableEntry: [tableNode, tablePath],
    rowEntry: [rowNode, rowPath],
    columnIndex,
  } = getTableFocusingInfos(editor);

  const tableWidth = rowNode.children.length;
  let focusPoint = null;

  // If table has one more column, remove column, else remove table
  if (tableWidth > 1) {
    // If removing column is the last column, focus on the previous column
    const isRemovingLastColumn = columnIndex === tableWidth - 1;

    tableNode.children.forEach((row, rowIndex) => {
      const removePath = tablePath.concat(rowIndex, columnIndex);
      Transforms.removeNodes(editor, { at: removePath });
    });

    // Update columns
    const align = [...tableNode.align];
    align.splice(columnIndex, 1);
    Transforms.setNodes(editor, { align }, { at: tablePath });

    focusPoint = isRemovingLastColumn
      ? Editor.start(editor, rowPath.concat(columnIndex - 1))
      : Editor.start(editor, rowPath.concat(columnIndex));

    focusEditor(editor, focusPoint);
  } else {
    removeTable(editor);
  }
};

/**
 * @param {Object} editor
 * @param {keyof TEXT_ALIGN} align Text align
 */
const changeColumnAlign = (editor, alignType) => {
  const {
    tableEntry: [table, tablePath],
    columnIndex,
  } = getTableFocusingInfos(editor);
  const selectGrid = getSelectGrid(editor);
  const align = [...table.align];

  // If select a range in table
  if (selectGrid) {
    const { startColIndex, endColIndex } = selectGrid;
    for (let columnIndex = startColIndex; columnIndex <= endColIndex; columnIndex++) {
      align.splice(columnIndex, columnIndex, alignType);
    }
  } else {
    // If select a cell in table
    align.splice(columnIndex, columnIndex, alignType);
  }

  Transforms.setNodes(editor, { align }, { at: tablePath });
};

export {
  insertRow,
  removeRow,
  removeTable,
  insertColumn,
  removeColumn,
  changeColumnAlign
};
