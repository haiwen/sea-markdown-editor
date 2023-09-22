/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useState } from 'react';
import { useSelected } from 'slate-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import ImagePreviewer from './image-previewer';
import './style.css';

const renderImage = (props) => {
  const { attributes, children, element } = props;
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreening, setIsFullScreening] = useState(false);
  const [imgSizeInfo, setImgSizeInfo] = useState({ heigth: 0, width: 0 });
  const { t } = useTranslation();
  const imgRef = useRef(null);
  const resizerRef = useRef();
  const isSelected = useSelected();

  const handleStartResize = (event) => {
    event.stopPropagation();
    setIsResizing(true);
    registerEvent();
  };

  const registerEvent = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const unregisterEvent = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const img = imgRef.current;
    const resizer = resizerRef.current;
    const changeX = event.clientX - resizer.getBoundingClientRect().left - 5;
    const imageWidth = img.width + changeX;
    if (imageWidth < 20) return;
    console.log('imageWidth', imageWidth);
    img.width = imageWidth;
    setImgSizeInfo({ heigth: img.clientHeight, width: img.clientWidth });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    unregisterEvent();
  };
  const toggleImagePreviewer = (event,imgUrl) => {
    event.preventDefault();
    setIsFullScreening(false);
  };

  return (
    <span
      {...attributes}
      contentEditable={false}
      className='seafile-image-wrapper'
    >
      <img
        ref={imgRef}
        className={classNames('seafile-image', { 'selected': isSelected })}
        alt={element.alt}
        src={element.url}
      />
      {isSelected &&
        <>
          <span ref={resizerRef} className='resizer' onMouseDown={handleStartResize}></span>
          <span className='full-screen' contentEditable={false} onClick={() => setIsFullScreening(true)}>
            <i className={'iconfont icon-fullscreen'} title={t('Full_screen')}></i>
          </span>
        </>
      }
      {isResizing && <span className='image-size-info-tooltip'>{`${t('Width')}:${imgSizeInfo.width}  ${t('Height')}:${imgSizeInfo.heigth}`}</span>}
      {isFullScreening && <ImagePreviewer
        imgUrl={element.url}
        toggleImagePreviewer={toggleImagePreviewer}
      />}
      {/* Children is required here,to fix issue "#3930" on github of slate  */}
      {children}
    </span>
  );
};

export default renderImage;
