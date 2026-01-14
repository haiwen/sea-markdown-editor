import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { insertTableElement, removeColumn, removeRow, removeTable } from '../table-operations';
import { TRANSLATE_NAMESPACE } from '../../../../constants';
import InsertTableElement from './insert-table-element';
import { TABLE_CELL_STYLE, TABLE_ELEMENT, TABLE_ELEMENT_POSITION } from '../constant';
import { getSelectedNodeByType } from '../../../core';
import { TABLE_CELL } from '../../../constants/element-types';
import HorizontalAlignPopover from './horizontal-align-popover';

import './style.css';

const ContextMenu = ({ element, position, editor, handleCloseContextMenu }) => {
  const [contextMenuStyle, setContextMenuStyle] = useState({});
  const contextMenuRef = useRef(null);
  const horizontalAlignRef = useRef(null);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const tableCellNodeId = getSelectedNodeByType(editor, TABLE_CELL)?.id;
  const cellDom = document.querySelector(`td[data-id="${tableCellNodeId}"]`);

  const horizontalAlign = cellDom?.style?.[TABLE_CELL_STYLE.TEXT_ALIGN];

  const currentRowsCount = useMemo(() => {
    const rows = element.children;
    return rows.length;
  }, [element.children]);

  const currentColumnsCount = useMemo(() => {
    const rows = element.children;
    const cols = rows[0].children;
    return cols.length;
  }, [element.children]);

  useLayoutEffect(() => {
    const { top, left } = position;
    setContextMenuStyle({ top, left, zIndex: '1071', display: 'block' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  const handleClickOperationBtn = (callback, ...arg) => {
    callback && callback(editor, ...arg);
    handleCloseContextMenu();
  };

  const _insertTableChildren = (type, position, count) => {
    insertTableElement(editor, type, position, count);
    handleCloseContextMenu();
  };

  return (
    <div contentEditable={false} style={contextMenuStyle} ref={contextMenuRef} className="sf-context-menu-wrapper">
      <div className='sf-context-menu sf-dropdown-list'>
        <InsertTableElement
          type={TABLE_ELEMENT.ROW}
          count={1}
          currentCount={currentRowsCount}
          position={TABLE_ELEMENT_POSITION.BEFORE}
          insertTableElement={_insertTableChildren}
        />
        <InsertTableElement
          type={TABLE_ELEMENT.ROW}
          count={1}
          currentCount={currentRowsCount}
          position={TABLE_ELEMENT_POSITION.AFTER}
          insertTableElement={_insertTableChildren}
        />
        <InsertTableElement
          type={TABLE_ELEMENT.COLUMN}
          count={1}
          currentCount={currentColumnsCount}
          position={TABLE_ELEMENT_POSITION.BEFORE}
          insertTableElement={_insertTableChildren}
        />
        <InsertTableElement
          type={TABLE_ELEMENT.COLUMN}
          count={1}
          currentCount={currentColumnsCount}
          position={TABLE_ELEMENT_POSITION.AFTER}
          insertTableElement={_insertTableChildren}
        />
        <div className={'sf-divider dropdown-divider'}></div>
        <button
          onMouseDown={() => handleClickOperationBtn(removeRow)}
          className={'sf-context-menu-item sf-dropdown-menu-item'}>
          {t('Delete_row')}
        </button>
        <button
          onMouseDown={() => handleClickOperationBtn(removeColumn)}
          className={'sf-context-menu-item sf-dropdown-menu-item'}>
          {t('Delete_column')}
        </button>
        <button
          onMouseDown={() => handleClickOperationBtn(removeTable)}
          className={'sf-context-menu-item sf-dropdown-menu-item'}>
          {t('Delete_table')}
        </button>
        <div className={'sf-divider dropdown-divider'}></div>
        <button
          ref={horizontalAlignRef}
          className="sf-context-menu-item sf-dropdown-menu-item side-extendable"
        >
          <span>{t('Horizontal_align')}</span>
          <i className='mdfont md-arrow-right'></i>
        </button>
        {horizontalAlignRef.current && <HorizontalAlignPopover target={horizontalAlignRef} editor={editor} horizontalAlign={horizontalAlign} />}
      </div>
    </div>
  );
};

ContextMenu.propTypes = {
  editor: PropTypes.object.isRequired,
  position: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
};

export default ContextMenu;
