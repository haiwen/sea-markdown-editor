
import React from 'react';
import { Node } from 'slate';
import { Placeholder } from '../../core';
import { SDOC_FONT_SIZE } from '../../constants/font';

export const renderTitle = (props, editor) => {
  const { element, attributes, children } = props;
  const style = {
    fontSize: `${SDOC_FONT_SIZE[element.type]}pt`,
    textAlign: element.align,
  };

  return (
    <div className='sdoc-header-title' data-id={element.id} data-root='true' {...attributes} style={{ ...style }}>
      {children}
    </div>
  );
};

export const renderSubtitle = (props, editor) => {
  const { element, attributes, children } = props;
  const style = {
    color: '#888',
    fontSize: `${SDOC_FONT_SIZE[element.type]}pt`,
    textAlign: element.align
  };

  return (
    <div className='sdoc-header-subtitle' data-id={element.id} data-root='true' {...attributes} style={{ ...style }}>
      {children}
    </div>
  );
};

export const renderHeader = (props, editor) => {
  const { element, attributes, children, isComposing } = props;
  const { type } = element;
  const level = type.split('header')[1];

  const style = {
    textAlign: element.align,
    fontSize: `${SDOC_FONT_SIZE[element.type]}pt`,
    ...(level === '6' && {fontStyle: 'italic'}),
  };

  let isShowPlaceHolder = false;
  const firstChild = editor.children[0];
  if (firstChild.id === element.id && Node.string(element) === '' && !isComposing) {
    isShowPlaceHolder = true;
  }

  return (
    <div
      className={`sdoc-header-${level}`}
      data-id={element.id}
      id={element.id} // used for click left outline item, page scroll this element
      data-root='true'
      {...attributes}
      style={{position: isShowPlaceHolder ? 'relative': '', ...style }}
    >
      {isShowPlaceHolder && <Placeholder title={'Please_enter_title'}/>}
      {children}
    </div>
  );
};
