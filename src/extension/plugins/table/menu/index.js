import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '../../../commons/menu/menu-item';
import { MENUS_CONFIG_MAP } from '../../../constants';
import { TABLE } from '../../../constants/element-types';
import { isDisabled, isInTable } from '../helper';
import TableSizeSelector from './table-size-selector';

import './style.css';

const menuConfig = MENUS_CONFIG_MAP[TABLE];
const propTypes = {
  editor: PropTypes.object.isRequired,
  readonly: PropTypes.bool.isRequired,
  className: PropTypes.string,
  isRichEditor: PropTypes.bool,
};

const TableMenu = ({ editor, readonly, className, isRichEditor }) => {
  const [isOpenTableSizeSelector, setIsOpenTableSizeSelector] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const disabled = useMemo(() => isDisabled(editor, readonly), [editor.selection, readonly]);
  const isActive = isInTable(editor);
  const tablePopoverRef = useRef(null);

  const onHideSelector = useCallback((e) => {
    if (e) {
      const menu = tablePopoverRef.current;
      const clickIsInMenu = menu && menu.contains(e.target) && menu !== e.target;
      if (clickIsInMenu) return;
    }
    setIsOpenTableSizeSelector(false);
    unregisterEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerEvent = useCallback(() => {
    document.addEventListener('mousedown', onHideSelector);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unregisterEvent = useCallback(() => {
    document.removeEventListener('mousedown', onHideSelector);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseDown = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    const newState = !isOpenTableSizeSelector;
    setIsOpenTableSizeSelector(newState);
    newState ? registerEvent() : unregisterEvent();
  }, [isOpenTableSizeSelector, registerEvent, unregisterEvent]);

  return (
    <div className='sf-table-menu-item'>
      <MenuItem
        isRichEditor={isRichEditor}
        className={className}
        disabled={disabled}
        isActive={isActive}
        onMouseDown={onMouseDown}
        editor={editor}
        {...menuConfig}
      />
      {isOpenTableSizeSelector && (
        <TableSizeSelector
          ref={tablePopoverRef}
          editor={editor}
          onHideSelector={onHideSelector}
        />)}
    </div>
  );
};

TableMenu.propTypes = propTypes;

export default TableMenu;
