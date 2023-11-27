import React from 'react';

const renderParagraph = ({ element, attributes, children }) => {
  return (
    <div data-id={element.id} data-root='true' {...attributes}>
      {children}
    </div>
  );
};

export default renderParagraph;
