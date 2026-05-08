import React, { useState } from 'react';
import { useSlateStatic } from 'slate-react';
import PropTypes from 'prop-types';
import Lightbox from '@seafile/react-image-lightbox';
import { getImagesUrlList, getNewImagesUrlList } from '../helper';
import { useTranslation } from 'react-i18next';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

import '@seafile/react-image-lightbox/style.css';
import './style.css';

const ImagePreviewer = ({ imgUrl, toggleImagePreviewer }) => {
  const editor = useSlateStatic();
  let defaultImages = getImagesUrlList(editor.children);
  const images = getNewImagesUrlList(defaultImages);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const [imageIndex, setImageIndex] = useState(
    Math.max(0, images.findIndex((item) => item.thumbnail === imgUrl))
  );
  const imagesLength = images.length;
  const imageItem = images[imageIndex];
  const imageName = imageItem ? imageItem.name : '';
  const mainSrc = imageItem ? imageItem.thumbnail : '';
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

  const imageTitleDOM = (
    <span className="d-flex">
      <span className="text-truncate">{imageName || ''}</span>
      <span className="flex-shrink-0 pl-1">({imageIndex + 1}/{imagesLength})</span>
    </span>
  );

  return (
    <Lightbox
      imageItems={images}
      currentIndex={imageIndex}
      setImageIndex={setImageIndex}
      wrapperClassName="sf-editor-image-previewer"
      imageTitle={imageTitleDOM}
      mainSrc={mainSrc}
      toolbarButtons={[]}
      nextSrc={nextImg.thumbnail || nextImg.src}
      prevSrc={prevImg.thumbnail || prevImg.src}
      onCloseRequest={toggleImagePreviewer}
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
    />
  );
};

ImagePreviewer.propTypes = {
  imgUrl: PropTypes.string.isRequired,
};

export default ImagePreviewer;
