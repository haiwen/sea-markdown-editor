import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { IMAGE } from '../../../constants/element-types';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { handleUpdateImage } from '../helper';
import DropdownMenuItem from '../../../commons/dropdown-menu-item';
import { UncontrolledPopover } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

import './index.css';

const menuConfig = MENUS_CONFIG_MAP[IMAGE];

const ImageMenu = ({ readonly, editor, toggle, setIsShowInternetImageModal }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const fileInputRef = useRef(null);

  const openFileDIalog = useCallback((e) => {
    e.stopPropagation();
    toggle && toggle();
    e.nativeEvent.stopImmediatePropagation();
    fileInputRef.current?.click();
  }, [toggle]);

  const handleUploadLocalImage = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleUpdateImage(editor, file);
    e.target.value = null;
  }, [editor]);

  return (
    <>
      <DropdownMenuItem disabled={readonly} menuConfig={menuConfig} className="pr-2">
        {!readonly && (
          <i className="iconfont icon-sdoc-right-slide sf-dropdown-item-right-icon"></i>
        )}
      </DropdownMenuItem>
      {!readonly && (
        <UncontrolledPopover
          target={menuConfig.id}
          trigger="hover"
          className="sf-menu-popover sf-dropdown-menu sf-sub-dropdown-menu sf-insert-image-menu-popover"
          placement="right-start"
          hideArrow={true}
          fade={false}
        >
          <div className="sf-insert-image-menu-popover-container sf-dropdown-menu-container">
            <div className="sf-dropdown-menu-item" onClick={openFileDIalog}>{t('Upload_local_image')}</div>
            <div className="sf-dropdown-menu-item" onClick={() => setIsShowInternetImageModal(true)}>{t('Insert_network_image')}</div>
          </div>
        </UncontrolledPopover>
      )}
      <input
        ref={fileInputRef}
        onClick={openFileDIalog}
        onChange={handleUploadLocalImage}
        style={{ display: 'none' }}
        type="file"
        accept='image/*'
      />
    </>
  );
};

ImageMenu.propTypes = {
  readonly: PropTypes.bool,
  editor: PropTypes.object,
};

export default ImageMenu;
