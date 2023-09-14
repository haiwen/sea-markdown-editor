import React, { useCallback } from 'react';
import { MenuItem } from '../../../commons';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { BLOCKQUOTE } from '../../../constants/element-types';
import { getBlockQuoteType, isMenuDisabled, setBlockQuoteType } from '../helpers';

const menuConfig = MENUS_CONFIG_MAP[BLOCKQUOTE];

const isActive = (editor) => {
  return getBlockQuoteType(editor) === BLOCKQUOTE;
};

export default function BlockquoteMenu(props) {
  const { isRichEditor, className, readonly, editor } = props;

  const onMousedown = useCallback((event) => {
    const active = isActive(editor);
    setBlockQuoteType(editor, active);
  }, [editor]);

  return (
    <MenuItem
      isRichEditor={isRichEditor}
      className={className}
      disabled={isMenuDisabled(editor, readonly)}
      isActive={isActive(editor)}
      onMouseDown={onMousedown}
      {...menuConfig}
    />
  );
}
