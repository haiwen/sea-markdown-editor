import React, { useRef } from 'react';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './style.css';

const imageMenuPopoverList = ['Insert_network_image', 'Upload_local_image'];

const ImageMenuPopover = (props) => {
  const { setIsShowImagePopover } = props;
  const popoverRef = useRef();
  const { t } = useTranslation();



  return (
    <div className='image-popover' ref={popoverRef}>
      {imageMenuPopoverList.map((item, index) => {
        return <div className='image-popover-item' key={`popover${item}${index}`}>{t(item)}</div>;
      })}
    </div>
  );
};

ImageMenuPopover.defaultProps = {
  className: '',
};

ImageMenuPopover.propTypes = {
  setIsShowImagePopover: propTypes.func.isRequired,
  isShowImagePopover: propTypes.bool.isRequired,
  className: propTypes.string,

};

export default ImageMenuPopover;
