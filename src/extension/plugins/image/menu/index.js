import React, { useState, useCallback, useEffect } from 'react';
import { IMAGE } from '../../../constants/element-types';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { isMenuDisabled } from '../helper';
import { MenuItem } from '../../../commons';
import ImageMenuPopover from './image-menu-popover';

const menuConfig = MENUS_CONFIG_MAP[IMAGE];

const ImageMenu = (props) => {
  const { isRichEditor, className, readonly, editor } = props;
  const [isShowImagePopover, setIsShowImagePopover] = useState(false);
  useEffect(() => {
    isShowImagePopover ? registerEventHandler() : unregisterEventHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowImagePopover]);

  const onMousedown = useCallback((e) => {
    e.stopPropagation();
    handleChangePopoverDisplayed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const registerEventHandler = () => {
    return document.addEventListener('click', handleChangePopoverDisplayed);
  };

  const unregisterEventHandler = () => {
    return document.removeEventListener('click', handleChangePopoverDisplayed);
  };

  const handleChangePopoverDisplayed = () => {
    setIsShowImagePopover(!isShowImagePopover);
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

      {isShowImagePopover && (
        <ImageMenuPopover
          editor={editor}
          setIsShowImagePopover={setIsShowImagePopover}
          unregisterEventHandler={unregisterEventHandler}
          hadnleClosePopover={handleChangePopoverDisplayed}
        />)
      }
    </>
  );
};

export default ImageMenu;
