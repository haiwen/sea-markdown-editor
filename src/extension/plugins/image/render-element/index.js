/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useRef, useState } from 'react';
import { useSelected } from 'slate-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { updateImage } from '../helper';
import ImagePreviewer from './image-previewer';

import './style.css';

const renderImage = ({ attributes, children, element }, editor) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreening, setIsFullScreening] = useState(false);
  const [imgSizeInfo, setImgSizeInfo] = useState({ height: 0, width: 0 });
  const { t } = useTranslation();
  const imgRef = useRef(null);
  const resizerRef = useRef();
  const isSelected = useSelected();

  const handleStartResize = (event) => {
    event.stopPropagation();
    const { clientHeight: height, clientWidth: width } = imgRef.current;
    setIsResizing(true);
    setImgSizeInfo({ width, height });

    const handleMouseMove = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const img = imgRef.current;
      const resizer = resizerRef.current;
      const changeX = event.clientX - resizer.getBoundingClientRect().left - 5;
      const imageWidth = img.width + changeX;
      if (imageWidth < 20) return;
      img.width = imageWidth;
      setImgSizeInfo({ height: img.clientHeight, width: img.clientWidth });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (!isResizing) {
        setIsResizing(false);
        const { clientHeight: height, clientWidth: width } = imgRef.current;
        updateImage(editor, { ...element.data, width, height });
      }
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleImagePreviewer = (event) => {
    event.preventDefault();
    setIsFullScreening(false);
  };

  return (
    <span
      {...attributes}
      contentEditable={false}
      className='sf-image-wrapper'
    >
      <img
        ref={imgRef}
        className={classNames('sf-image', { 'selected': isSelected })}
        alt={element?.data?.alt}
        src={element?.data?.src}
        width={element?.data.width}
        height={element?.data.height}
      />
      {isSelected && (
        <>
          <span ref={resizerRef} className='resizer' onMouseDown={handleStartResize}></span>
          <span className='full-screen' contentEditable={false} onClick={() => setIsFullScreening(true)}>
            <i className={'iconfont icon-fullscreen'} title={t('Full_screen')}></i>
          </span>
        </>
      )}
      {isResizing && (
        <span className='image-size-info-tooltip'>
          {`${t('Width')}:${imgSizeInfo.width}  ${t('Height')}:${imgSizeInfo.height}`}
        </span>)}
      {isFullScreening && (
        <ImagePreviewer
          imgUrl={element?.data?.src}
          toggleImagePreviewer={toggleImagePreviewer}
        />)}
      {/* Children is required here, to fix issue "#3930" on github of slate  */}
      {children}
    </span>
  );
};

export default renderImage;
