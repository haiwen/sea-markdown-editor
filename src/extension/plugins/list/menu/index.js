import React, { useCallback, useMemo } from 'react';
import propTypes from 'prop-types';
import MenuItem from '../../../commons/menu/menu-item';
import { getListLineEntries, isMenuDisabled, transformToList, transformToParagraph } from '../helpers';
import { MENUS_CONFIG_MAP } from '../../../constants';
import { ORDERED_LIST, UNORDERED_LIST } from '../../../constants/element-types';

const propType = {
  editor: propTypes.object.isRequired,
  readonly: propTypes.bool.isRequired,
  isRichEditor: propTypes.bool,
  type: propTypes.oneOf([ORDERED_LIST, UNORDERED_LIST]).isRequired,
  className: propTypes.string,
};

const ListMenu = ({ editor, readonly, isRichEditor, type, className }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isDisabled = useMemo(() => isMenuDisabled(editor, readonly), [editor.selection, readonly]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isActive = useMemo(() => !!Array.from(getListLineEntries(editor, type)).length, [editor, editor.selection]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const menuConfig = useMemo(() => MENUS_CONFIG_MAP[type], []);
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    isActive ? transformToParagraph(editor) : transformToList(editor, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // transformToParagraph(editor)
  return (
    <MenuItem
      isRichEditor={isRichEditor}
      isActive={isActive}
      disabled={isDisabled}
      className={className}
      onMouseDown={onMouseDown}

      {...menuConfig}
    />
  );
};

ListMenu.propTypes = propType;

export default ListMenu;
