import { Editor, Transforms } from 'slate';
import { INSERT_POSITION } from '../../constants';
import { getSelectGrid, getTableEntry, getTableFocusingInfos } from './helper';
import { generateTableCell, generateTableRow } from './model';
import { focusEditor } from '../../core';

/**
 * @param {Object} editor
 * @param {INSERT_POSITION.AFTER | INSERT_POSITION.BEFORE} isnertPosition by default is INSERT_POSITION.AFTER
 */
const insertRow = (editor, position = INSERT_POSITION.AFTER) => {
  const {
    tableEntry: [, tablePath],
    rowEntry: [rowNode],
    rowIndex,
  } = getTableFocusingInfos(editor);

  const handlePosition = {
    [INSERT_POSITION.BEFORE]: (rowIndex) => tablePath.concat(rowIndex),
    [INSERT_POSITION.AFTER]: (rowIndex) => tablePath.concat(rowIndex + 1),
  };

  const insertPath = handlePosition[position](rowIndex);
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
  const previouseNodeEntry = Editor.previous(editor, { at: tablePath });
  const focusPoint = Editor.end(editor, previouseNodeEntry[1]);
  Transforms.removeNodes(editor, { at: tablePath });
  focusEditor(editor, focusPoint);
};

/**
 * @param {Object} editor
 * @param {INSERT_POSITION.AFTER | INSERT_POSITION.BEFORE} isnertPosition by default is INSERT_POSITION.AFTER
 */
const insertColumn = (editor, isnertPosition = INSERT_POSITION.AFTER) => {
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
    return newCellPath[isnertPosition](rowIndex, columnIndex);
  };


  tableNode.children.forEach((row, rowIndex) => {
    const insertPath = getInsertPath(rowIndex, columnIndex);
    const newCell = generateTableCell(rowIndex, columnIndex);
    Transforms.insertNodes(editor, newCell, { at: insertPath });
  });

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
const changeCellAlign = (editor, align) => {
  const {
    tableEntry: [, tablePath],
    columnIndex,
    rowIndex,
  } = getTableFocusingInfos(editor);
  const selectGrid = getSelectGrid(editor);

  // If select a range in table
  if (selectGrid) {
    const { startRowIndex, endRowIndex, startColIndex, endColIndex } = selectGrid;
    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
      for (let columnIndex = startColIndex; columnIndex <= endColIndex; columnIndex++) {
        const cellPath = tablePath.concat(rowIndex, columnIndex);
        Transforms.setNodes(editor, { align }, { at: cellPath });
      }
    }
  } else {
    // If select a cell in table
    const cellPath = tablePath.concat(rowIndex, columnIndex);
    Transforms.setNodes(editor, { align }, { at: cellPath });
  }
};

export {
  insertRow,
  removeRow,
  removeTable,
  insertColumn,
  removeColumn,
  changeCellAlign
};
