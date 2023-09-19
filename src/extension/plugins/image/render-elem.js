import React from 'react';

const renderImage = (props) => {
  const { attributes, children, element } = props;
  return (
    <div>
      <div {...attributes} contentEditable={false}>
        <img src={element.url} alt={element.alt} />
      </div>
      {children}
    </div>
  );
};

export default renderImage;
