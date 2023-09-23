import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Label } from 'reactstrap';
import { ImageMenuInsertInternetDialog } from './image-menu-dialog';
import { insertImage } from '../helper';

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

  const handleClickFileInput = (e) => {
    e.target.value = null;
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
  };

  const handleUploadLocalImage = async (e) => {
    if (editor.api.uploadLocalImage) {
      console.log('e.target.files', e.target.files);
      const file = e.target.files[0];
      try {
        const res = await editor.api.uploadLocalImage(file);
        console.log('res', res);
      } catch (error) {
        console.log('error', error);
      }
    }


    try {
      if (editor.api.uploadLocalImage) {
        // todo The upload is temporarily suspended
        const file = e.target.files[0];
        const reader = new FileReader();
        file && reader.readAsDataURL(file);
        reader.onloadend = () => {
          // todo The upload is temporarily suspended, instead of using localStorage
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
      {
        isShowInternetImageModal && <ImageMenuInsertInternetDialog
          editor={editor}
          onToggleImageDialog={onToggleImageDialog}
        />
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
