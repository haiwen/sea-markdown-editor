import React, { useCallback, useMemo } from 'react';
import MenuItem from '../../../commons/menu/menu-item';
import { getListType, isMenuDisabled } from '../helpers';
import { MENUS_CONFIG_MAP } from '../../../constants';


const ListMenu = ({ editor, readonly, isRichEditor, listType, classname }) => {
  const isDisabled = useMemo(() => isMenuDisabled(editor, readonly), [editor, readonly]);
  const isActive = useMemo(() => getListType(editor) === listType, [editor, listType]);
  const menuConfig = MENUS_CONFIG_MAP[listType];

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <MenuItem
      isRichEditor={isRichEditor}
      isActive={isActive}
      disabled={isDisabled}
      className={classname}
      onMouseDown={onMouseDown}

      {...menuConfig}
    />
  );
};

export default ListMenu;
