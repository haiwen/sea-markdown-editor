import React, { useCallback, useMemo, useState } from 'react';
import propType from 'prop-types';
import classNames from 'classnames';
import { insertTable } from '../helper';

import './style.css';

const TableSizeSelector = React.forwardRef(({ editor, onHideSelector }, ref) => {
  const [selectedGridInfo, setSelectedGridInfo] = useState({ row: 0, column: 0 });
  const [showingGridInfo, setShowingGridInfo] = useState({ row: 4, column: 4 });

  const preRenderTableGrid = useCallback((rowIndex, columnIndex) => {
    const selectedRowNums = rowIndex + 1;
    const selectedColumnNums = columnIndex + 1;
    let preRenderRowNum = selectedRowNums + 1;
    let preRenderColumnNum = selectedColumnNums + 1;
    if (preRenderRowNum < 4) {
      preRenderRowNum = 4;
    } else if (preRenderRowNum > 10) {
      preRenderRowNum = 10;
    }
    if (preRenderColumnNum < 4) {
      preRenderColumnNum = 4;
    } else if (preRenderColumnNum > 10) {
      preRenderColumnNum = 10;
    }
    setSelectedGridInfo({ row: selectedRowNums, column: selectedColumnNums });
    setShowingGridInfo({ row: preRenderRowNum, column: preRenderColumnNum });
  }, []);

  const handleClickTableCell = useCallback(() => {
    insertTable(editor, selectedGridInfo.row, selectedGridInfo.column);
    onHideSelector();
  }, [editor, onHideSelector, selectedGridInfo.column, selectedGridInfo.row]);

  const generateTableGrid = useCallback((rowNum, columnNum) => {
    const { row: selectedRowIndex, column: selectedColumnIndex } = selectedGridInfo;
    const rowElements = [];
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
      const columnElements = [];
      for (let columnIndex = 0; columnIndex < columnNum; columnIndex++) {
        const isCellSelected = selectedRowIndex > rowIndex && selectedColumnIndex > columnIndex;
        columnElements.push(
          <div
            onClick={handleClickTableCell}
            onMouseEnter={() => preRenderTableGrid(rowIndex, columnIndex)}
            className={classNames('sf-table-selector-cell', { selected: isCellSelected })}
            key={`${rowIndex}-${columnIndex}`}
          >
          </div>
        );
      }
      rowElements.push(<div className='sf-table-row' key={rowIndex}>{columnElements}</div>);
    }
    return rowElements;
  }, [handleClickTableCell, preRenderTableGrid, selectedGridInfo]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableGridElement = useMemo(() => generateTableGrid(showingGridInfo.row, showingGridInfo.column), [generateTableGrid]);

  return (
    <div className='sf-table-size-selector-card' ref={ref}>
      <p className='sf-table-grid-info'>{`${selectedGridInfo.row} x ${selectedGridInfo.column}`}</p>
      {tableGridElement}
    </div>
  );
});

TableSizeSelector.propTypes = {
  editor: propType.object.isRequired,
};

export default TableSizeSelector;
