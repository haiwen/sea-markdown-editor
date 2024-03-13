import React, { useState, useCallback, useEffect } from 'react';
import { IMAGE } from '../../../constants/element-types';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { isMenuDisabled } from '../helper';
import { MenuItem } from '../../../commons';
import ImageMenuPopover from './image-menu-popover';

const menuConfig = MENUS_CONFIG_MAP[IMAGE];

const ImageMenu = ({ isRichEditor, className, readonly, editor, isSupportInsertSeafileImage }) => {
  const [isShowImagePopover, setIsShowImagePopover] = useState(false);

  useEffect(() => {
    isShowImagePopover ? registerEventHandler() : unregisterEventHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowImagePopover]);

  const handleChangePopoverDisplayed = useCallback(() => {
    setIsShowImagePopover(!isShowImagePopover);
  }, [isShowImagePopover]);

  const onMousedown = useCallback((e) => {
    e.stopPropagation();
    handleChangePopoverDisplayed();
  }, [handleChangePopoverDisplayed]);

  const registerEventHandler = () => {
    return window.addEventListener('click', handleChangePopoverDisplayed);
  };

  const unregisterEventHandler = () => {
    return window.removeEventListener('click', handleChangePopoverDisplayed);
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
        {...menuConfig}
      />
      {isShowImagePopover && (
        <ImageMenuPopover
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
