import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TEXT_ALIGN } from '../../../constants';
import { TABLE_BODY_NODE_NAME, TABLE_CELL_NODE_NAME, TABLE_ROW_NODE_NAME } from '../constant';
import ContextMenu from './context-menu';

import './style.css';

const RenderTableContainer = ({ attributes, children, element }, editor) => {
  const tableRef = useRef(null);
  const startGridRef = useRef({ rowIndex: -1, colIndex: -1 });
  const [, setSelectGridRange] = useState({ startRowIndex: -1, startColIndex: -1, endRowIndex: -1, endColIndex: -1 });
  const [isShowContextMenu, setIsShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    clearSelectedCells();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', unregisterEventHandler);
      document.removeEventListener('keyup', unregisterEventHandler);
      document.removeEventListener('keyup', clearSelectedCells);
      document.removeEventListener('mousedown', clearSelectedCells);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTableElement = useCallback((node, type) => {
    let target = node;
    if (target.nodeName.toLowerCase() === type) return target;
    while (target.nodeName.toLowerCase() !== type) {
      target = target.parentNode;
    }
    return target;
  }, []);

  const clearSelectedCells = useCallback((e) => {
    isShowContextMenu && handleCloseContextMenu();
    tableRef.current.querySelectorAll('.selected-cell')
      .forEach(selectedCell => {
        selectedCell.classList.remove(
          'selected-cell',
          'selected-cell-left',
          'selected-cell-bottom',
          'selected-cell-top',
          'selected-cell-right'
        );
      });
    document.removeEventListener('keyup', clearSelectedCells);
    document.removeEventListener('click', clearSelectedCells);
  }, [isShowContextMenu]);

  const updateSelectedCellStyles = useCallback((startRowIndex, endRowIndex, startColIndex, endColIndex,) => {
    clearSelectedCells();
    if (startColIndex < 0 || startRowIndex < 0) return;
    for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
      let currentRow = tableRef.current.querySelectorAll(TABLE_ROW_NODE_NAME)[rowIndex];
      for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
        const selectedCell = currentRow.querySelectorAll(TABLE_CELL_NODE_NAME)[colIndex];
        selectedCell.classList.add('selected-cell');
        // Set selected cell border
        rowIndex === startRowIndex && selectedCell.classList.add('selected-cell-top');
        colIndex === startColIndex && selectedCell.classList.add('selected-cell-left');
        colIndex === endColIndex && selectedCell.classList.add('selected-cell-right');
        rowIndex === endRowIndex && selectedCell.classList.add('selected-cell-bottom');
      }
    }
    setSelectGridRange({ startRowIndex, endRowIndex, startColIndex, endColIndex, });
  }, [clearSelectedCells]);

  const selectCellsInTable = useCallback((e) => {
    // Check if the target is in the table
    if (e.target.nodeName.toLowerCase() === TABLE_BODY_NODE_NAME || !tableRef.current.contains(e.target)) return;
    // Figure out select range
    const { startRowIndex, startColIndex } = startGridRef.current;
    const endRowIndex = getTableElement(e.target, TABLE_ROW_NODE_NAME).rowIndex;
    const endColIndex = getTableElement(e.target, TABLE_CELL_NODE_NAME).cellIndex;
    const minRowIndex = Math.min(startRowIndex, endRowIndex);
    const maxRowIndex = Math.max(startRowIndex, endRowIndex);
    const minColIndex = Math.min(startColIndex, endColIndex);
    const maxColIndex = Math.max(startColIndex, endColIndex);
    // Select one cell
    if (minRowIndex === maxRowIndex && minColIndex === maxColIndex) return;
    // collapse selection
    window.getSelection().collapseToEnd();
    updateSelectedCellStyles(minRowIndex, maxRowIndex, minColIndex, maxColIndex);
  }, [getTableElement, updateSelectedCellStyles]);

  const handleMouseUp = useCallback((e) => {
    document.removeEventListener('mousemove', selectCellsInTable);
    document.removeEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', clearSelectedCells);
    document.addEventListener('mousedown', clearSelectedCells);
  }, [clearSelectedCells, selectCellsInTable]);

  const handleMouseDown = useCallback((e) => {
    // Clear last rendered styles
    clearSelectedCells();
    // Set new select range
    const startRowIndex = getTableElement(e.target, TABLE_ROW_NODE_NAME).rowIndex;
    const startColIndex = getTableElement(e.target, TABLE_CELL_NODE_NAME).cellIndex;
    startGridRef.current = { startRowIndex: startRowIndex, startColIndex: startColIndex };
    document.addEventListener('mousemove', selectCellsInTable);
    document.addEventListener('mouseup', handleMouseUp);
  }, [clearSelectedCells, getTableElement, handleMouseUp, selectCellsInTable]);

  const handleContextMenu = useCallback((e) => {
    if (!tableRef.current.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = tableRef.current.getBoundingClientRect();
    setContextMenuPosition({ top: e.clientY - y, left: e.clientX - x });
    setIsShowContextMenu(true);
    document.addEventListener('mousedown', unregisterEventHandler);
    document.addEventListener('keyup', unregisterEventHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unregisterEventHandler = useCallback(() => {
    document.removeEventListener('mousedown', handleContextMenu);
  }, [handleContextMenu]);

  const handleCloseContextMenu = () => {
    setIsShowContextMenu(false);
  };

  return (
    <div style={{ position: 'relative' }} >
      <table ref={tableRef} onMouseDown={handleMouseDown} className='sf-table-container'>
        <tbody {...attributes}>
          {children}
        </tbody>
      </table>
      {isShowContextMenu && <ContextMenu handleCloseContextMenu={handleCloseContextMenu} position={contextMenuPosition} editor={editor} />}
    </div>
  );
};

export default RenderTableContainer;

export const RenderTableRow = ({ attributes, children, element }) => {
  return (
    <tr {...attributes}>{children}</tr>
  );
};

export const RenderTableCell = ({ attributes, children, element }) => {
  const { align = TEXT_ALIGN.LEFT } = element;
  return (
    <td data-root='true' style={{ textAlign: align }} {...attributes}>
      {children}
    </td>
  );
};
