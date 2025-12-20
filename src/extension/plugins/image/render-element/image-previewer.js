import React, { useState } from 'react';
import { useSlateStatic } from 'slate-react';
import PropTypes from 'prop-types';
import Lightbox from '@seafile/react-image-lightbox';
import { getImagesUrlList } from '../helper';
import { useTranslation } from 'react-i18next';
import { isMac} from '../../../../utils/common';

import '@seafile/react-image-lightbox/style.css';
import './style.css';

const ImagePreviewer = ({ imgUrl, toggleImagePreviewer }) => {
  const editor = useSlateStatic();
  let images = getImagesUrlList(editor.children);
  const t = useTranslation(TRANSLATE_NAMESPACE);
  const [imageIndex, setImageIndex] = useState(images.findIndex((item) => item === imgUrl));
  const mainSrc = images[imageIndex];
  const shortcutMain = isMac() ? '⌘' : 'Ctrl';

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
      imageTitle={<ImageTitleElement mainSrc={mainSrc} imageIndex={imageIndex} images={images} />}
      mainSrc={mainSrc}
      toolbarButtons={[]}
      nextSrc={images[(imageIndex + 1) % images.length]}
      prevSrc={images[(imageIndex + images.length - 1) % images.length]}
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
      zoomInTip={t('Enlarge: {Ctrl} + Wheel').replace('{Ctrl}', shortcutMain)}
      zoomOutTip={t('Shrink: {Ctrl} + Wheel').replace('{Ctrl}', shortcutMain)}
    />
  );
};

ImagePreviewer.propTypes = {
  imgUrl: PropTypes.string.isRequired,
};

export default ImagePreviewer;

const ImageTitleElement = (props) => {
  const { mainSrc, imageIndex, images, } = props;
  const getImgTitle = () => {
    try {
      return mainSrc ? decodeURI(mainSrc.slice(mainSrc.lastIndexOf('/') + 1)) : '';
    } catch (error) {
      console.log('error', error);
      return '';
    }
  };
  return (
    <>
      <span className="d-flex">
        <span className="text-truncate">{getImgTitle()}</span>
        <span className="flex-shrink-0">({imageIndex + 1}/{images.length})</span>
      </span>
    </>
  );
};
