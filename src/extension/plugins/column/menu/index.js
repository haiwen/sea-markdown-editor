import React, { useCallback } from 'react';
import { MenuItem } from '../../../commons';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { COLUMN } from '../../../constants/element-types';
import { getColumnType, isMenuDisabled, insertSeaTableColumn } from '../helpers';

const menuConfig = MENUS_CONFIG_MAP[COLUMN];

const isActive = (editor) => {
  return getColumnType(editor) === COLUMN;
};

export default function ColumnMenu({ isRichEditor, className, readonly, editor }) {

  const onMousedown = useCallback((event) => {
    const active = isActive(editor);
    insertSeaTableColumn(editor, active);
  }, [editor]);

  return (
    <MenuItem
      isRichEditor={isRichEditor}
      className={className}
      disabled={isMenuDisabled(editor, readonly)}
      isActive={isActive(editor)}
      onMouseDown={onMousedown}

      {...menuConfig}
    />
  );
}
