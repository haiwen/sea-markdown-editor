import React, { Fragment, useCallback, useState } from 'react';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ImageMenuInsertInternetDialog from './image-menu-dialog';
import EventBus from '../../../../utils/event-bus';
import { EXTERNAL_EVENTS } from '../../../../constants/event-types';
import { insertImage } from '../helper';

import './style.css';

const ImageMenuPopover = ({ editor, handelClosePopover, isSupportInsertSeafileImage }) => {
  const [isShowInternetImageModal, setIsShowInternetImageModal] = useState(false);
  const { t } = useTranslation();

  const handleInsertNetworkImage = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    setIsShowInternetImageModal(true);
  };

  const handleClickFileInput = useCallback((e) => {
    e.stopPropagation();
    e.target.value = null;
    e.nativeEvent.stopImmediatePropagation();
  }, []);

  const handleUploadLocalImage = useCallback(async (e) => {
    if (editor.api.uploadLocalImage) {
      const file = e.target.files[0];
      try {
        const imgUrl = await editor.api.uploadLocalImage(file);
        insertImage(editor, imgUrl);
      } catch (error) {
        console.log('error', error);
      }
    }
    handelClosePopover();
  }, [editor, handelClosePopover]);

  const onToggleImageDialog = useCallback(() => {
    setIsShowInternetImageModal(false);
    handelClosePopover();
  }, [handelClosePopover]);

  const handleInsertLibraryImage = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.ON_INSERT_IMAGE, editor.selection);
    handelClosePopover();
  };

  return (
    <Fragment>
      <div className='image-popover'>
        <div className='image-popover-item' onClick={handleInsertNetworkImage}>{t('Insert_network_image')}</div>
        <div className='image-popover-item' onClick={handleClickFileInput} >
          {t('Upload_local_image')}
        </div>
        <input
          onClick={handleClickFileInput}
          onChange={handleUploadLocalImage}
          type="file"
          accept='image/*'
          className='image-uploader'
          id='image-uploader'
        />
        {isSupportInsertSeafileImage && (
          <div className='image-popover-item' onClick={handleInsertLibraryImage}>{t('Insert_library_image')}</div>
        )}
      </div>
      {isShowInternetImageModal && (
        <ImageMenuInsertInternetDialog
          editor={editor}
          onToggleImageDialog={onToggleImageDialog}
        />
      )}
    </Fragment>
  );
};

ImageMenuPopover.defaultProps = {
};

ImageMenuPopover.propTypes = {
  editor: propTypes.object.isRequired,
  handelClosePopover: propTypes.func.isRequired,
};

export default ImageMenuPopover;
