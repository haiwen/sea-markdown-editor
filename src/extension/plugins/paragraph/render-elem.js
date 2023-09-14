import React from 'react';

const renderParagraph = ({ element, attributes, children }) => {
  return (
    <p data-id={element.id} data-root='true' {...attributes}>
      {children}
    </p>
  );
};

export default renderParagraph;
