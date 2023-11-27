import React from 'react';
import { Node } from 'slate';
import { Placeholder, getNodeType } from '../../core';
import { ELementTypes } from '../../constants';

export const renderHeader = (props, editor) => {
  const { element, attributes, children } = props;
  const HeaderTagName = `h${getHeaderTagName(element)}`;
  const style = {
    textAlign: element.align,
  };

  function getHeaderTagName(element) {
    const currentNodeType = getNodeType(element);
    if (currentNodeType.indexOf(ELementTypes.HEADER) > -1) {
      return currentNodeType.split(ELementTypes.HEADER)[1];
    }
    return 'p';
  }

  return (
    <HeaderTagName
      data-id={element.id}
      id={element.id} // used for click left outline item, page scroll this element
      data-root='true'
      {...attributes}
      style={style}
    >
      {children}
    </HeaderTagName>
  );
};
