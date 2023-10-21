import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '../../../commons/menu/menu-item';
import { MENUS_CONFIG_MAP } from '../../../constants';
import { TABLE } from '../../../constants/element-types';
import { isDisabled } from '../helper';
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
  const menuItemClassName = useMemo(() => className ? className + ' sf-table-menu-item' : 'sf-table-menu-item', [className]);
  const isActive = false;

  const onSelectorHide = useCallback(() => {
    // setIsOpenTableSizeSelector(false);
    unregisterEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsOpenTableSizeSelector]);


  const registerEvent = useCallback(() => {
    document.addEventListener('click', onSelectorHide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unregisterEvent = useCallback(() => {
    // document.removeEventListener('click', onSelectorHide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseDown = useCallback((e) => {
    setIsOpenTableSizeSelector(true);
    registerEvent();
  }, [setIsOpenTableSizeSelector, registerEvent]);
  console.log('isOpenTableSizeSelector', isOpenTableSizeSelector)
  return (
    <div className='sf-table-menu-item'>
      <MenuItem
        isRichEditor={isRichEditor}
        className={className}
        disabled={disabled}
        isActive={isActive}
        onMouseDown={onMouseDown}

        {...menuConfig}
      />
      {isOpenTableSizeSelector && (
        <TableSizeSelector
          editor={editor}
        />)}
    </div>
  );
};

TableMenu.propTypes = propTypes;

export default TableMenu;
