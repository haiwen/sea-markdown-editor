import React, { useCallback } from 'react';
import { MenuItem } from '../../../commons';
import { CODE_BLOCK } from '../../../constants/element-types';
import { isCodeBlockNode, isMenuDisabled, transformToCodeBlock, unwrapCodeBlock } from '../helpers';
import { MENUS_CONFIG_MAP } from '../../../constants';

const menuConfig = MENUS_CONFIG_MAP[CODE_BLOCK];

const CodeBlockMenu = ({ isRichEditor, className, readonly, editor }) => {
  const isActive = isCodeBlockNode(editor);
  const onMousedown = useCallback((e) => {
    e.stopPropagation();
    isActive ? unwrapCodeBlock(editor) : transformToCodeBlock(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <>
      <MenuItem
        type={CODE_BLOCK}
        isRichEditor={isRichEditor}
        className={className}
        disabled={isMenuDisabled(editor, readonly)}
        isActive={isActive}
        onMouseDown={onMousedown}

        {...menuConfig}
      />
    </>
  );
};

export default CodeBlockMenu;
