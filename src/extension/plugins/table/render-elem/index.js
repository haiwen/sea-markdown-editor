import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReadOnly, useSlateStatic } from 'slate-react';
import { Editor } from 'slate';
import { TABLE_BODY_NODE_NAME, TABLE_CELL_NODE_NAME, TABLE_ROW_NODE_NAME } from '../constant';
import ContextMenu from '../context-menu';
import { getContextMenuPosition } from '../helper';
import { findPath } from '../../../core';
import { TEXT_ALIGN } from '../../../constants';
import EventBus from '../../../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../../../constants/event-types';

import './style.css';

const RenderTableContainer = ({ attributes, children, element }, editor) => {
  const tableRef = useRef(null);
  const startGridRef = useRef({ rowIndex: -1, colIndex: -1 });
  const [isShowContextMenu, setIsShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [, setSelectGridRange] = useState({ startRowIndex: -1, startColIndex: -1, endRowIndex: -1, endColIndex: -1 });
  const isReadonly = useReadOnly();

  useEffect(() => {
    if (isReadonly) return;
    clearSelectedCells();
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('mousedown', handleOutsideMouseDown);

    const eventBus = EventBus.getInstance();
    const unSubscribe = eventBus.subscribe(INTERNAL_EVENTS.ON_SELECT_ALL_CELL, handleSelectAllCells);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('mousedown', handleOutsideMouseDown);
      unSubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTableElement = useCallback((node, type) => {
    let target = node;
    if (target.nodeName?.toLowerCase() === type) return target;
    while (target.nodeName && (target.nodeName?.toLowerCase() !== type)) {
      target = target.parentNode;
    }
    return target;
  }, []);

  const clearSelectedCells = useCallback((e) => {
    handleCloseContextMenu();
    // Keep selecting when using alignment tool
    const isTriggerByAlignmentTool = document.querySelector('.sf-table-operations-group')?.contains(e?.target);
    if (isTriggerByAlignmentTool) return;

    tableRef.current?.querySelectorAll('.selected-cell')
      .forEach(selectedCell => {
        selectedCell.classList.remove(
          'selected-cell',
          'selected-cell-left',
          'selected-cell-bottom',
          'selected-cell-top',
          'selected-cell-right'
        );
      });
  }, []);

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

  const handleSelectAllCells = useCallback((tableId) => {
    if (tableId !== element.id) return;
    const startRowIndex = 0;
    const startColIndex = 0;
    const endRowIndex = element.children.length - 1;
    const endColIndex = element.children[0].children.length - 1;

    updateSelectedCellStyles(startRowIndex, endRowIndex, startColIndex, endColIndex);
  }, [element.children, element.id, updateSelectedCellStyles]);

  // select table cells
  const handleMouseMove = useCallback((e) => {
    // Check if the target is in the table
    if (e.target.nodeName?.toLowerCase() === TABLE_BODY_NODE_NAME || !tableRef.current.contains(e.target)) return;
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


  // end select table cells
  const handleMouseUp = useCallback((e) => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target.nodeName?.toLowerCase() === TABLE_BODY_NODE_NAME || !tableRef.current.contains(e.target)) return;
    // Clear last rendered styles
    clearSelectedCells();
    // Set new select range
    const startRowIndex = getTableElement(e.target, TABLE_ROW_NODE_NAME).rowIndex;
    const startColIndex = getTableElement(e.target, TABLE_CELL_NODE_NAME).cellIndex;
    startGridRef.current = { startRowIndex: startRowIndex, startColIndex: startColIndex };

    // begin select table cells
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [clearSelectedCells, getTableElement, handleMouseMove, handleMouseUp]);

  const handleOutsideMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    clearSelectedCells();
  }, [clearSelectedCells]);

  const handleContextMenu = useCallback((e) => {
    if (!tableRef.current.contains(e.target)) {
      handleCloseContextMenu();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const position = getContextMenuPosition(e, tableRef);
    setContextMenuPosition(position);
    setIsShowContextMenu(true);
  }, []);

  const handleCloseContextMenu = () => {
    setIsShowContextMenu(false);
  };

  return (
    <div style={{ position: 'relative' }} data-id={element.id}>
      <table ref={tableRef} onMouseDown={handleMouseDown} className='sf-table-container'>
        <tbody {...attributes}>
          {children}
        </tbody>
      </table>
      {isShowContextMenu && <ContextMenu element={element} handleCloseContextMenu={handleCloseContextMenu} position={contextMenuPosition} editor={editor} />}
    </div>
  );
};

export default RenderTableContainer;

export const RenderTableRow = ({ attributes, children, element }) => {
  return (
    <tr {...attributes} data-id={element.id}>{children}</tr>
  );
};

export const RenderTableCell = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const cellPath = findPath(editor, element, [0, 0]);
  const pathLength = cellPath.length;
  const cellIndex = cellPath[pathLength - 1];
  const rowEntry = Editor.parent(editor, cellPath);
  const tableEntry = Editor.parent(editor, rowEntry[1]);
  const table = tableEntry[0];

  let style = {};
  if (table.align && Array.isArray(table.align)) {
    style['textAlign'] = table.align[cellIndex] || TEXT_ALIGN.LEFT;
  } else {
    style['textAlign'] = TEXT_ALIGN.LEFT;
  }

  return (
    <td data-root='true' data-id={element.id} style={style} {...attributes}>
      {children}
    </td>
  );
};
