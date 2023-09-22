import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Label } from 'reactstrap';
import { insertImage } from '../helper';
import { ImageMenuInsertInternetDialog } from './image-menu-dialog';

import './style.css';

const ImageMenuPopover = (props) => {
  const { editor, hadnleClosePopover } = props;

  const [isShowInternetImageModal, setIsShowInternetImageModal] = useState(false);
  const { t } = useTranslation();

  const handleInsertNextworkImage = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    setIsShowInternetImageModal(true);
  };

  const handleUploadLocalImage = async (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    try {
      if (editor.editorApi.uploadLocalImage) {
        const file = e.target.files[0];
        const reader = new FileReader();
        file && reader.readAsDataURL(file);
        reader.onloadend = () => {
          // todo The upload is temporarily suspended
          insertImage(editor, reader.result);
          hadnleClosePopover();
        };
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const onToggleImageDialog = () => {
    setIsShowInternetImageModal(false);
    hadnleClosePopover();
  };

  return (
    <div className='image-popover'>
      <div className='image-popover-item' onClick={handleInsertNextworkImage}>{t('Insert_network_image')}</div>
      <Label className='image-popover-item' for='image-uploader' onClick={handleUploadLocalImage}>
        {t('Upload_local_image')}
      </Label>
      <input
        onClick={handleUploadLocalImage}
        onChange={handleUploadLocalImage}
        type="file"
        accept='image/*'
        className='image-uploader'
        id='image-uploader'
      />
      {
        isShowInternetImageModal && (
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
  hadnleClosePopover: propTypes.func.isRequired,
};

export default ImageMenuPopover;
