import React, { useState } from 'react';
import { useSlateStatic } from 'slate-react';
import PropTypes from 'prop-types';
import Lightbox from '@seafile/react-image-lightbox';
import { ELementTypes } from '../../../constants';
import '@seafile/react-image-lightbox/style.css';
import './style.css';

const ImagePreviewer = (props) => {
  const { imgUrl, toggleImagePreviewer } = props;

  const editor = useSlateStatic();
  let images = getImagesUrlList(editor.children);

  const [imageIndex, setImageIndex] = useState(images.findIndex((item) => item === imgUrl));

  const mainSrc = images[imageIndex];

  function getImagesUrlList(nodes) {
    let nodeIndex = 0;
    const list = [];
    while (nodes && nodeIndex <= nodes.length - 1) {
      const currentNode = nodes[nodeIndex];
      if (currentNode.type === ELementTypes.IMAGE) {
        currentNode.url && list.push(currentNode.url);
      } else {
        list.push(...getImagesUrlList(currentNode.children));
      }
      nodeIndex++;
    }
    return list;
  }

  const moveToPrevImage = () => {
    setImageIndex((prevState) => {
      return (prevState + images.length - 1) % images.length;
    });
  };

  const moveToNextImage = () => {
    setImageIndex((prevState) => {
      return (prevState + 1) % images.length;
    });
  };

  return (
    <Lightbox
      wrapperClassName="sf-editor-image-previewer"
      imageTitle={<ImageTitleElement itleElement mainSrc={mainSrc} imageIndex={imageIndex} images={images} />}
      mainSrc={mainSrc}
      toolbarButtons={[]}
      nextSrc={images[(imageIndex + 1) % images.length]}
      prevSrc={images[(imageIndex + images.length - 1) % images.length]}
      onCloseRequest={toggleImagePreviewer}
      onMovePrevRequest={moveToPrevImage}
      onMoveNextRequest={moveToNextImage}
      imagePadding={70}
      reactModalStyle={{
        overlay: {
          zIndex: 1071
        }
      }}
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
      error.log(error);
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
