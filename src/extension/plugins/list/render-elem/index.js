import React from 'react';
import { ORDERED_LIST } from '../../../constants/element-types';

import './style.css';

const renderList = (props, editor) => {
  const { attributes, children, element: node } = props;
  const Tag = node.type === ORDERED_LIST ? 'ol' : 'ul';
  return <Tag data-id={node.id} data-root='true' className="sf-list-line" {...attributes}>{children}</Tag>;
};

const renderListItem = (props, editor) => {
  const { attributes, children, element } = props;
  return <li data-id={element.id} data-root='true' {...attributes} >{children}</li>;
};

const renderListLic = (props, editor) => {
  const { attributes, children, element } = props;
  return <div data-id={element.id} {...attributes}>{children}</div>;
};

export {
  renderList,
  renderListItem,
  renderListLic,
};
