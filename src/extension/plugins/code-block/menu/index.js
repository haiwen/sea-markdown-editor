import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '../../../commons';
import { CODE_BLOCK } from '../../../constants/element-types';
import { isInCodeBlock, isMenuDisabled, transformToCodeBlock, unwrapCodeBlock } from '../helpers';
import { MENUS_CONFIG_MAP } from '../../../constants';

const menuConfig = MENUS_CONFIG_MAP[CODE_BLOCK];
const propTypes = {
  isRichEditor: PropTypes.bool,
  className: PropTypes.string,
  readonly: PropTypes.bool,
  editor: PropTypes.object,
};

const CodeBlockMenu = ({ isRichEditor, className, readonly, editor }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isActive = useMemo(() => isInCodeBlock(editor), [editor.selection]);
  const onMousedown = useCallback((e) => {
    e.preventDefault();
    isActive ? unwrapCodeBlock(editor) : transformToCodeBlock(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);
  return (
    <MenuItem
      type={CODE_BLOCK}
      isRichEditor={isRichEditor}
      className={className}
      disabled={isMenuDisabled(editor, readonly)}
      isActive={isActive}
      onMouseDown={onMousedown}

      {...menuConfig}
    />
  );
};

CodeBlockMenu.propTypes = propTypes;

export default CodeBlockMenu;
