/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelected } from 'slate-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { lazyLoadImage, updateImage } from '../helper';
import ImagePreviewer from './image-previewer';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

import './style.css';

const renderImage = ({ attributes, children, element }, editor) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isError, setIsError] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreening, setIsFullScreening] = useState(false);
  const [imgSizeInfo, setImgSizeInfo] = useState({ height: 0, width: 0 });
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const imgRef = useRef(null);
  const resizerRef = useRef();
  const isSelected = useSelected();

  useEffect(() => {
    const { data = {} } = element;
    const url = data.src;
    lazyLoadImage(url, (image) => {
      setIsLoadingImage(false);
      setIsError(false);
    }, () => {
      setIsLoadingImage(false);
      setIsError(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartResize = useCallback((event) => {
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
      const imageHeight = imageWidth / img.naturalWidth * img.naturalHeight;
      if (imageWidth < 20 ) return;
      img.width = imageWidth;
      img.height = imageHeight;
      setImgSizeInfo({ width: img.clientWidth, height: img.clientHeight });
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
  }, [editor, element.data, isResizing]);

  const toggleImagePreviewer = useCallback((event) => {
    event.preventDefault();
    setIsFullScreening(false);
  }, []);

  return (
    <span
      {...attributes}
      contentEditable={false}
      className='sf-image-wrapper'
    >
      {isLoadingImage && <span>{t('Image_is_uploading')}...</span>}
      {!isLoadingImage && (
        <img
          ref={imgRef}
          className={classNames('sf-image', { 'selected': isSelected, 'error': isError })}
          alt={element?.data?.alt || ''}
          src={element?.data?.src}
          width={element?.data.width}
          height={element?.data.height}
        />
      )}
      {isSelected && !isError && (
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
