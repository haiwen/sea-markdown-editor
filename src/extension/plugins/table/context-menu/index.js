import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { insertTableElement, removeColumn, removeRow, removeTable } from '../table-operations';
import { TRANSLATE_NAMESPACE } from '../../../../constants';
import InsertTableElement from './insert-table-element';
import { TABLE_ELEMENT, TABLE_ELEMENT_POSITION } from '../constant';

import './style.css';

const ContextMenu = ({ element, position, editor, handleCloseContextMenu }) => {
  const [contextMenuStyle, setContextMenuStyle] = useState({});
  const contextMenuRef = useRef(null);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
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
