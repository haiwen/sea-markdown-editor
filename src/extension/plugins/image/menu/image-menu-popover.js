import React, { useCallback, useState } from 'react';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Label } from 'reactstrap';
import ImageMenuInsertInternetDialog from './image-menu-dialog';
import { insertImage } from '../helper';

import './style.css';

const ImageMenuPopover = ({ editor, handelClosePopover }) => {
  const [isShowInternetImageModal, setIsShowInternetImageModal] = useState(false);
  const { t } = useTranslation();

  const handleInsertNextworkImage = (e) => {
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

  return (
    <div className='image-popover'>
      <div className='image-popover-item' onClick={handleInsertNextworkImage}>{t('Insert_network_image')}</div>
      <Label className='image-popover-item' for='image-uploader' onClick={handleClickFileInput} >
        {t('Upload_local_image')}
      </Label>
      <input
        onClick={handleClickFileInput}
        onChange={handleUploadLocalImage}
        type="file"
        accept='image/*'
        className='image-uploader'
        id='image-uploader'
      />
      {isShowInternetImageModal && (
        <ImageMenuInsertInternetDialog
          editor={editor}
          onToggleImageDialog={onToggleImageDialog}
        />)
      }
    </div>
  );
};

ImageMenuPopover.defaultProps = {
};

ImageMenuPopover.propTypes = {
  editor: propTypes.object.isRequired,
  handelClosePopover: propTypes.func.isRequired,
};

export default ImageMenuPopover;
