import React, { useMemo } from 'react';
import MenuDropDown from '../../../commons/menu/menu-drop-down';
import { MENUS_CONFIG_MAP, TABLE_SUBMENU_MAP, TEXT_ALIGN } from '../../../constants';
import MenuItem from '../../../commons/menu/menu-item';
import { changeCellAlign, insertColumn, insertRow, removeColumn, removeRow, removeTable } from '../table-operations';

const AlignmentDropDown = ({ editor, readonly }) => {
  const alignmentOperationDropDownList = useMemo(() => [
    {
      ...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_ALIGN_LEFT],
      handleClick: (item) => changeCellAlign(editor, TEXT_ALIGN.LEFT)
    },
    {
      ...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_ALIGN_CENTER],
      handleClick: (item) => changeCellAlign(editor, TEXT_ALIGN.CENTER)
    },
    {
      ...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_ALIGN_RIGHT],
      handleClick: (item) => changeCellAlign(editor, TEXT_ALIGN.RIGHT)
    },
  ], [editor]);

  return (
    <MenuDropDown
      editor={editor}
      readonly={readonly}
      isDisabled={false}
      dropDownList={alignmentOperationDropDownList}
      isShowListItemIcon={true}
      {...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_ALIGN_LEFT]}
    />
  );
};

const ColumnOperationDropDownList = ({ editor, readonly }) => {
  const columnOperationDropDownList = useMemo(() => [
    {
      ...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_INSERT_COLUMN],
      handleClick: (item) => insertColumn(editor)
    },
    {
      ...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_REMOVE_COLUMN],
      handleClick: (item) => removeColumn(editor)
    },
  ], [editor]);

  return (
    <MenuDropDown
      editor={editor}
      readonly={readonly}
      isDisabled={false}
      dropDownList={columnOperationDropDownList}
      {...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_INSERT_COLUMN]}
    />
  );
};

const RowOperationDropDownList = ({ editor, readonly }) => {
  const rowOperationDropDownList = useMemo(() => [
    {
      ...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_INSERT_ROW],
      handleClick: (item) => insertRow(editor)
    },
    {
      ...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_REMOVE_ROW],
      handleClick: (item) => removeRow(editor)
    },
  ], [editor]);

  return (
    <MenuDropDown
      editor={editor}
      readonly={readonly}
      isDisabled={false}
      dropDownList={rowOperationDropDownList}
      {...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_INSERT_ROW]}
    />
  );
};

const RemoveTableMenu = ({ editor, readonly, className, isRichEditor }) => {
  return (
    <MenuItem
      isRichEditor={isRichEditor}
      className={className}
      disabled={false}
      isActive={false}
      onMouseDown={() => removeTable(editor)}
      editor={editor}

      {...MENUS_CONFIG_MAP[TABLE_SUBMENU_MAP.TABLE_DELETE_TABLE]}
    />
  );
};

export {
  AlignmentDropDown,
  ColumnOperationDropDownList,
  RowOperationDropDownList,
  RemoveTableMenu
};
