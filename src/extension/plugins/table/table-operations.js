import { Editor, Transforms } from 'slate';
import { INSERT_POSITION, TEXT_ALIGN } from '../../constants';
import { getSelectGrid, getTableEntry, getTableFocusingInfos } from './helper';
import { generateTableCell, generateTableRow } from './model';
import { focusEditor } from '../../core';

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
    removeTable(editor);
  }
};

const removeTable = (editor) => {
  const [tableNodeEntry] = getTableEntry(editor);
  if (!tableNodeEntry) return;

  const [, tablePath] = tableNodeEntry;
  const previousNodeEntry = Editor.previous(editor, { at: tablePath });
  const focusPoint = Editor.end(editor, previousNodeEntry[1]);
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
