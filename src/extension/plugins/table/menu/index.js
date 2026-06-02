import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledPopover } from 'reactstrap';
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
  toggle: PropTypes.func,
};

const TableMenu = ({ editor, readonly, toggle }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const disabled = useMemo(() => isDisabled(editor, readonly), [editor.selection, readonly]);

  return (
    <>
      <DropdownMenuItem disabled={disabled} menuConfig={menuConfig} className="pr-2">
        {!disabled && (
          <i className="mdfont md-arrow-right sf-dropdown-item-right-icon"></i>
        )}
      </DropdownMenuItem>
      {!disabled && (
        <UncontrolledPopover
          target={menuConfig.id}
          trigger="hover"
          className="sf-dropdown-menu sf-sub-dropdown-menu sf-table-size-selector-popover"
          placement="right-start"
          hideArrow={true}
          fade={false}
          offset={[0, 8]}
        >
          <TableSizeSelector editor={editor} onHideSelector={toggle} />
        </UncontrolledPopover>
      )}
    </>
  );
};

TableMenu.propTypes = propTypes;

export default TableMenu;
