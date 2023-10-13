import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MENUS_CONFIG_MAP } from '../../../constants';
import { CHECK_LIST_ITEM } from '../../../constants/element-types';
import MenuItem from '../../../commons/menu/menu-item';
import { isDisabledMenu, transformToCheckList } from '../helper';
import { transformToParagraph } from '../../paragraph/helper';
import { getSelectedNodeByType } from '../../../core';

const menuConfig = MENUS_CONFIG_MAP[CHECK_LIST_ITEM];
const propTypes = {
  editor: PropTypes.object.isRequired,
  readonly: PropTypes.bool.isRequired,
  className: PropTypes.string,
  isRichEditor: PropTypes.bool,
};

const CheckListMenu = ({ editor, readonly, className, isRichEditor }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isDisabled = useMemo(() => isDisabledMenu(editor), [editor.selection, readonly]);
  const isActive = !!getSelectedNodeByType(editor, CHECK_LIST_ITEM);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    isActive ? transformToParagraph(editor) : transformToCheckList(editor, editor.selection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

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
