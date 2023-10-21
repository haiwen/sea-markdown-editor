import React, { useEffect, useMemo, useState } from 'react'

import './style.css';
import classNames from 'classnames';

const TableSizeSelector = () => {
  const [selectedGridInfo, setSelectedGridInfo] = useState({ row: 0, column: 0 });
  const [showingGridInfo, setShowingGridInfo] = useState({ row: 4, column: 4 });

  useEffect(() => {

  }, [])

  const preRenderTableGrid = (rowIndex, columnIndex) => {
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
  }

  const generateTableGrid = (rowNum, columnNum) => {
    const { row: selectedRowIndex, column: selectedColumnIndex } = selectedGridInfo;
    const rowElements = [];
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
      const columnElements = [];
      for (let columnIndex = 0; columnIndex < columnNum; columnIndex++) {
        const isCellSelected = selectedRowIndex > rowIndex && selectedColumnIndex > columnIndex;
        columnElements.push(<div className={classNames('sf-table-selector-cell', { selected: isCellSelected })} onMouseEnter={() => preRenderTableGrid(rowIndex, columnIndex)} key={`${rowIndex}-${columnIndex}`}></div>);
      }
      rowElements.push(<div className='sf-table-row' key={rowIndex}>{columnElements}</div>);
    }
    return rowElements;
  }

  const tableGridElment = useMemo(() => generateTableGrid(showingGridInfo.row, showingGridInfo.column), [showingGridInfo]);

  console.log('tableGridElment', tableGridElment)

  return (
    <div className='sf-table-size-selector-card'>
      <p className='sf-table-grid-info'>{`${selectedGridInfo.row} x ${selectedGridInfo.column}`}</p>
      {tableGridElment}
    </div>
  )
}

export default TableSizeSelector;
