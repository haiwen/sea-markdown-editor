import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MENUS_CONFIG_MAP } from '../../../constants';
import { TABLE } from '../../../constants/element-types';
import { isDisabled } from '../helper';
import TableSizeSelector from './table-size-selector';
import DropdownMenuItem from '../../../commons/dropdown-menu-item';

import './style.css';

const menuConfig = MENUS_CONFIG_MAP[TABLE];
const propTypes = {
  editor: PropTypes.object.isRequired,
  readonly: PropTypes.bool.isRequired,
  className: PropTypes.string,
  isRichEditor: PropTypes.bool,
};

const TableMenu = ({ editor, readonly, toggle }) => {
  const [isOpenTableSizeSelector, setIsOpenTableSizeSelector] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const disabled = useMemo(() => isDisabled(editor, readonly), [editor.selection, readonly]);
  const tablePopoverRef = useRef(null);

  const handleMouseEnter = () => setIsOpenTableSizeSelector(true);
  const handleMouseLeave = () => setIsOpenTableSizeSelector(false);

  return (
    <div className='table-menu-container' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <DropdownMenuItem disabled={disabled} menuConfig={menuConfig} className="pr-2">
        {!disabled && (
          <i className="iconfont icon-right-slide sf-dropdown-item-right-icon"></i>
        )}
      </DropdownMenuItem>
      {!disabled && isOpenTableSizeSelector && (
        <TableSizeSelector
          ref={tablePopoverRef}
          editor={editor}
          onHideSelector={toggle}
        />)}
    </div>
  );
};

TableMenu.propTypes = propTypes;

export default TableMenu;
