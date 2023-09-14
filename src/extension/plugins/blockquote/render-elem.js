
import React from 'react';

const renderBlockquote = (props) => {
  const { attributes, children, element } = props;
  return <blockquote data-id={element.id} data-root='true' {...attributes}>{children}</blockquote>;
};

export default renderBlockquote;
