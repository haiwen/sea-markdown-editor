import React, { useCallback } from 'react';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { COLUMN } from '../../../constants/element-types';
import { getColumnType, insertSeaTableColumn } from '../helpers';
import DropdownMenuItem from '../../../commons/dropdown-menu-item';

const menuConfig = MENUS_CONFIG_MAP[COLUMN];

const isActive = (editor) => {
  return getColumnType(editor) === COLUMN;
};

export default function ColumnMenu({ readonly, editor, toggle }) {

  const insertColumn = useCallback((event) => {
    event.stopPropagation();
    toggle && toggle();
    const active = isActive(editor);
    insertSeaTableColumn(editor, active);
  }, [editor, toggle]);

  return (
    <DropdownMenuItem disabled={readonly} menuConfig={menuConfig} className="pr-2" onClick={insertColumn}>
    </DropdownMenuItem>
  );
}
