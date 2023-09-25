import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ELementTypes, MENUS_CONFIG_MAP } from '../../../constants';
import MenuItem from '../../../commons/menu/menu-item';
import { getIsMenuDisabled, getIsMarkActive, handleSetMark, handleRemoveMark } from '../helper';

const textStyleList = [ELementTypes.ITALIC, ELementTypes.BOLD, ELementTypes.CODE_LINE];

const TextStyleMenu = (props) => {
  const { editor, readonly, type, isRichEditor, classname } = props;
  const config = MENUS_CONFIG_MAP[type];
  const isDisabled = getIsMenuDisabled(editor, readonly);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isActive = useMemo(() => getIsMarkActive(editor, type));

  const handleClickMenu = useCallback((e, toggleType) => {
    e.preventDefault();
    e.stopPropagation();
    isActive ? handleRemoveMark(editor, type) : handleSetMark(editor, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <div>
      <MenuItem
        editor={editor}
        disabled={isDisabled}
        isActive={isActive}
        isRichEditor={isRichEditor}
        classname={classname}
        onMouseDown={handleClickMenu}
        {...config}
      />
    </div>
  );
};

TextStyleMenu.propTypes = {
  editor: PropTypes.object.isRequired,
  readonly: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(textStyleList).isRequired,
  isRichEditor: PropTypes.bool,
  classname: PropTypes.string,
};

export default TextStyleMenu;
