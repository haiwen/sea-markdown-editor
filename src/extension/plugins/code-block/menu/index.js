import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CODE_BLOCK } from '../../../constants/element-types';
import { isInCodeBlock, transformToCodeBlock, unwrapCodeBlock } from '../helpers';
import { MENUS_CONFIG_MAP } from '../../../constants';
import DropdownMenuItem from '../../../commons/dropdown-menu-item';

const menuConfig = MENUS_CONFIG_MAP[CODE_BLOCK];
const propTypes = {
  isRichEditor: PropTypes.bool,
  className: PropTypes.string,
  readonly: PropTypes.bool,
  editor: PropTypes.object,
};

const CodeBlockMenu = ({ readonly, editor, toggle }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isActive = useMemo(() => isInCodeBlock(editor), [editor.selection]);
  const onMousedown = useCallback((e) => {
    e.preventDefault();
    isActive ? unwrapCodeBlock(editor) : transformToCodeBlock(editor);
    toggle && toggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <DropdownMenuItem disabled={readonly} menuConfig={menuConfig} className="pr-2" onClick={onMousedown}>
    </DropdownMenuItem>
  );
};

CodeBlockMenu.propTypes = propTypes;

export default CodeBlockMenu;
