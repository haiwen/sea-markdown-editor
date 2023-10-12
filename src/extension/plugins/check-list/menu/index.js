import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MENUS_CONFIG_MAP } from '../../../constants';
import { CHECK_LIST_ITEM } from '../../../constants/element-types';
import MenuItem from '../../../commons/menu/menu-item';
import { getCheckListEntryList, isDisabledMenu, transformToCheckList } from '../helper';

const menuConfig = MENUS_CONFIG_MAP[CHECK_LIST_ITEM];
const propTypes = {
  editor: PropTypes.object.isRequired,
  isReadonly: PropTypes.bool.isRequired,
  className: PropTypes.string,
  isRichEditor: PropTypes.bool,
};

const CheckListMenu = ({ editor, readonly, className, isRichEditor }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isDisabled = useMemo(() => isDisabledMenu(editor), [editor.selection, readonly]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isActive = useMemo(() => !!getCheckListEntryList(editor).length, [editor.selection, editor]);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    transformToCheckList(editor)
    console.log('clicked');
  }, []);

  return (
    <MenuItem
      isRichEditor={isRichEditor}
      className={className}
      disabled={isDisabled}
      isActive={isActive}
      onMouseDown={onMouseDown}

      {...menuConfig}
    />
  );
};

CheckListMenu.propTypes = propTypes;

export default CheckListMenu;
