import React, { useCallback, useMemo } from 'react';
import propTypes from 'prop-types';
import MenuItem from '../../../commons/menu/menu-item';
import { getActiveListType, isMenuDisabled } from '../helpers';
import { MENUS_CONFIG_MAP } from '../../../constants';
import { transformsToList } from '../transforms';
import { focusEditor } from '../../../core';
import { ORDERED_LIST, UNORDERED_LIST } from '../../../constants/element-types';

const propType = {
  editor: propTypes.object.isRequired,
  readonly: propTypes.bool.isRequired,
  isRichEditor: propTypes.bool,
  type: propTypes.oneOf([ORDERED_LIST, UNORDERED_LIST]).isRequired,
  className: propTypes.string,
};

const ListMenu = ({ editor, readonly, isRichEditor, type, className }) => {
  const isActive = getActiveListType(editor, type) === type;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const menuConfig = useMemo(() => MENUS_CONFIG_MAP[type], []);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    transformsToList(editor, type);
    focusEditor(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <MenuItem
      isRichEditor={isRichEditor}
      isActive={isActive}
      disabled={isMenuDisabled(editor, readonly)}
      className={className}
      onMouseDown={onMouseDown}

      {...menuConfig}
    />
  );
};

ListMenu.propTypes = propType;

export default ListMenu;
