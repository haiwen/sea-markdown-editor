import React, { useState } from 'react';
import { useSlateStatic } from 'slate-react';
import PropTypes from 'prop-types';
import Lightbox from '@seafile/react-image-lightbox';
import { getImagesUrlList } from '../helper';
import { useTranslation } from 'react-i18next';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

import '@seafile/react-image-lightbox/style.css';
import './style.css';

const formatImageInfos = (images) => {
  const formatImages = images.map(src => {
    let name = '';
    try {
      name = src ? decodeURI(src.slice(src.lastIndexOf('/') + 1)).split(/[?？]/)[0] : '';
    } catch (error) {
      console.log('error', error);
      name = '';
    }

    return {
      name: name,
      thumbnail: src,
    };
  });
  return formatImages;
};

const ImagePreviewer = ({ imgUrl, toggleImagePreviewer }) => {
  const editor = useSlateStatic();
  const originImages = getImagesUrlList(editor.children);
  const images = formatImageInfos(originImages);

  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const [imageIndex, setImageIndex] = useState(Math.max(0, images.findIndex((item) => item.thumbnail === imgUrl)));

  const imagesLength = images.length;
  const imageItem = images[imageIndex];
  const imageName = imageItem ? imageItem.name : '';
  const mainSrc = imageItem ? imageItem.thumbnail : {};
  const nextImg = images[(imageIndex + 1) % images.length];
  const prevImg = images[(imageIndex + images.length - 1) % images.length];

  const moveToPrevImage = () => {
    const currentImageIndex = (imageIndex + images.length - 1) % images.length;
    setImageIndex(currentImageIndex);
  };

  const moveToNextImage = () => {
    const newImageIndex = (imageIndex + 1) % images.length;
    setImageIndex(newImageIndex);
  };

  return (
    <Lightbox
      imageItems={images}
      currentIndex={imageIndex}
      setImageIndex={setImageIndex}
      wrapperClassName="sf-editor-image-previewer"
      imageTitle={`${imageName} (${imageIndex + 1}/${imagesLength})`}
      mainSrc={mainSrc}
      toolbarButtons={[]}
      nextSrc={nextImg.thumbnail || nextImg.src}
      prevSrc={prevImg.thumbnail || prevImg.src}
      onCloseRequest={toggleImagePreviewer}
      reactModalProps={{ shouldReturnFocusAfterClose: true, preventScroll: true }}
      onMovePrevRequest={moveToPrevImage}
      onMoveNextRequest={moveToNextImage}
      imagePadding={70}
      reactModalStyle={{
        overlay: {
          zIndex: 1071
        }
      }}
      zoomInTip={t('Zoom_in')}
      zoomOutTip={t('Zoom_out')}
      closeTip={t('Close')}
    />
  );
};

ImagePreviewer.propTypes = {
  imgUrl: PropTypes.string.isRequired,
};

export default ImagePreviewer;
