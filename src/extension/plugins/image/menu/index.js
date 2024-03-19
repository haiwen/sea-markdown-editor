import React, { useState, useCallback, useEffect, useRef } from 'react';
import { IMAGE } from '../../../constants/element-types';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { isMenuDisabled } from '../helper';
import { MenuItem } from '../../../commons';
import ImageMenuPopover from './image-menu-popover';

const menuConfig = MENUS_CONFIG_MAP[IMAGE];

const ImageMenu = ({ isRichEditor, className, readonly, editor, isSupportInsertSeafileImage }) => {
  const [isShowImagePopover, setIsShowImagePopover] = useState(false);
  const imagePopoverRef = useRef(null);

  const handleChangePopoverDisplayed = useCallback((e) => {
    if (e) {
      const menu = imagePopoverRef.current;
      const clickIsInMenu = menu && menu.contains(e.target) && menu !== e.target;
      if (clickIsInMenu) return;
    }
    setIsShowImagePopover(false);
  }, []);

  const registerEventHandler = useCallback(() => {
    document.addEventListener('mousedown', handleChangePopoverDisplayed);
  }, [handleChangePopoverDisplayed]);

  const unregisterEventHandler = useCallback(() => {
    document.removeEventListener('mousedown', handleChangePopoverDisplayed);
  }, [handleChangePopoverDisplayed]);

  const onImageMenuToggle = useCallback((e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const state = !isShowImagePopover;
    if (state) {
      setIsShowImagePopover(state);
      console.log(state);
      registerEventHandler();
    } else {
      setIsShowImagePopover(state);
      unregisterEventHandler();
    }
  }, [isShowImagePopover, registerEventHandler, unregisterEventHandler]);

  return (
    <>
      <MenuItem
        type={Image}
        isRichEditor={isRichEditor}
        className={className}
        disabled={isMenuDisabled(editor, readonly)}
        isActive={isShowImagePopover}
        onMouseDown={onImageMenuToggle}
        {...menuConfig}
      />
      {isShowImagePopover && (
        <ImageMenuPopover
          ref={imagePopoverRef}
          editor={editor}
          setIsShowImagePopover={setIsShowImagePopover}
          unregisterEventHandler={unregisterEventHandler}
          handelClosePopover={handleChangePopoverDisplayed}
          isSupportInsertSeafileImage={isSupportInsertSeafileImage}
        />
      )}
    </>
  );
};

export default ImageMenu;
