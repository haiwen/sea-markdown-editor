import React, { useState, useCallback } from 'react';
import { MenuItem } from '../../../commons';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { IMAGE } from '../../../constants/element-types';
import ImageMenuPopover from './image-menu-popover';
import { isMenuDisabled } from '../helper';

const menuConfig = MENUS_CONFIG_MAP[IMAGE];

const ImageMenu = (props) => {
  const { isRichEditor, className, readonly, editor } = props;

  const [isShowImagePopover, setIsShowImagePopover] = useState(false);
  console.log('readonly', readonly)
  const onMousedown = useCallback((e) => {
    e.stopPropagation();
    onHideHanderMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const registerEventHandler = () => {
    return document.addEventListener('click', onHideHanderMenu);
  };

  const unregisterEventHandler = () => {
    return document.removeEventListener('click', onHideHanderMenu);
  };

  const onHideHanderMenu = () => {
    setIsShowImagePopover(prev => {
      prev ? unregisterEventHandler() : registerEventHandler();
      return !prev;
    });
  };

  return (
    <>
      <MenuItem
        type={Image}
        isRichEditor={isRichEditor}
        className={className}
        disabled={isMenuDisabled(editor, readonly)}
        isActive={isShowImagePopover}
        onMouseDown={onMousedown}
        {...menuConfig} />

      {
        isShowImagePopover && <ImageMenuPopover
          setIsShowImagePopover={setIsShowImagePopover}
          isShowImagePopover={isShowImagePopover}
        />
      }
    </>

  );
};

export default ImageMenu;
