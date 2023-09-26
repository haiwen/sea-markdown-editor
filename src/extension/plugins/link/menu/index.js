import React, { useMemo } from 'react'
import MenuItem from '../../../commons/menu/menu-item'
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config'
import { LINK } from '../../../constants/element-types'
import { isActive, isDisabled } from '../helper'

const menuConfig = MENUS_CONFIG_MAP[LINK]

const LinkMenu = (props) => {
  const { isRichEditor, className, readonly, editor } = props;

  const onMouseDown = (event) => {
    console.log('LinkMenu.onMouseDown');
    // const active = isActive(editor);
    // setBlockQuoteType(editor, active);
  };

  return (
    <MenuItem
      isRichEditor={isRichEditor}
      className={className}
      disabled={isDisabled(editor, readonly)}
      isActive={isActive(editor)}
      onMouseDown={onMouseDown}

      {...menuConfig}
    />
  )
}

export default LinkMenu;
