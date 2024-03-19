import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { insertColumn, insertRow, removeColumn, removeRow } from '../table-operations';
import { INSERT_POSITION } from '../../../constants';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

const ContextMenu = ({ position, editor, handleCloseContextMenu }) => {
  const [contextMenuStyle, setContextMenuStyle] = useState({});
  const contextMenuRef = useRef(null);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  useLayoutEffect(() => {
    generateContextMenuStyle(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  const generateContextMenuStyle = useCallback((position) => {
    const menuHeight = contextMenuRef.current.offsetHeight;
    // get height of context menu when the menu is drawing completed in this page
    menuHeight === 0 && requestAnimationFrame(generateContextMenuStyle);
    const documentHeight = document.body.clientHeight;
    const isContextMenuOutOfScreen = position.top + menuHeight > documentHeight;
    let top = isContextMenuOutOfScreen ? documentHeight - menuHeight - 5 : position.top;
    const left = position.left + 3;
    setContextMenuStyle({ top, left, zIndex: '1071', display: 'block' });
  }, []);

  const handleClickOperationBtn = (callback, ...arg) => {
    callback && callback(editor, ...arg);
    handleCloseContextMenu();
  };

  return (
    <div contentEditable={false} style={contextMenuStyle} ref={contextMenuRef} className={'sf-context-menu sf-dropdown-list'} >
      <button
        onMouseDown={() => handleClickOperationBtn(insertRow, INSERT_POSITION.BEFORE)}
        className={'sf-context-menu-item sf-dropdown-menu-item'}>
        {t('Insert_row_before')}
      </button>
      <button
        onMouseDown={() => handleClickOperationBtn(insertRow)}
        className={'sf-context-menu-item sf-dropdown-menu-item'}>
        {t('Insert_row_after')}
      </button>
      <button
        onMouseDown={() => handleClickOperationBtn(insertColumn, INSERT_POSITION.BEFORE)}
        className={'sf-context-menu-item sf-dropdown-menu-item'}>
        {t('Insert_column_before')}
      </button>
      <button
        onMouseDown={() => handleClickOperationBtn(insertColumn, INSERT_POSITION.AFTER)}
        className={'sf-context-menu-item sf-dropdown-menu-item'}>
        {t('Insert_column_after')}
      </button>
      <div className={'sf-divider dropdown-divider'}></div>
      <button
        onMouseDown={() => handleClickOperationBtn(removeRow)}
        className={'sf-context-menu-item sf-dropdown-menu-item'}>
        {t('Remove_row')}
      </button>
      <button
        onMouseDown={() => handleClickOperationBtn(removeColumn)}
        className={'sf-context-menu-item sf-dropdown-menu-item'}>
        {t('Remove_column')}
      </button>
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
