import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ImageMenuInsertInternetDialog from './image-menu-dialog';
import EventBus from '../../../../utils/event-bus';
import { EXTERNAL_EVENTS } from '../../../../constants/event-types';
import { handleUpdateImage } from '../helper';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

import './style.css';

const ImageMenuPopover = React.forwardRef(({ editor, handelClosePopover, isSupportInsertSeafileImage }, ref) => {
  const [isShowInternetImageModal, setIsShowInternetImageModal] = useState(false);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const handleInsertNetworkImage = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsShowInternetImageModal(true);
  };

  const handleClickFileInput = useCallback((e) => {
    e.stopPropagation();
    e.target.value = null;
    e.nativeEvent.stopImmediatePropagation();
  }, []);

  const handleUploadLocalImage = useCallback(async (e) => {
    const file = e.target.files[0];
    handleUpdateImage(editor, file);
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
      <div className='sf-image-popover' ref={ref}>
        <div className='sf-image-popover-item' onClick={handleInsertNetworkImage}>{t('Insert_network_image')}</div>
        <label htmlFor='sf-image-uploader' className='sf-image-popover-item' onClick={handleClickFileInput} >
          {t('Upload_local_image')}
        </label>
        <input
          onClick={handleClickFileInput}
          onChange={handleUploadLocalImage}
          type="file"
          accept='image/*'
          className='sf-image-uploader'
          id='sf-image-uploader'
        />
        {isSupportInsertSeafileImage && (
          <div className='sf-image-popover-item' onClick={handleInsertLibraryImage}>{t('Insert_library_image')}</div>
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
});

ImageMenuPopover.defaultProps = {
};

ImageMenuPopover.propTypes = {
  isSupportInsertSeafileImage: PropTypes.bool,
  editor: PropTypes.object.isRequired,
  handelClosePopover: PropTypes.func.isRequired,
};

export default ImageMenuPopover;
