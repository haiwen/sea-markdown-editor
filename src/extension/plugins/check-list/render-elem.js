/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import './style.css';

const renderCheckListItem = ({ attributes, children, element }, editor) => {
  const { id, checked = false } = element || {};
  const onChange = (event) => {
    const checked = event.target.checked;
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { checked }, { at: path });
  };

  const { className } = attributes;
  
  return (
    <div data-id={id} data-root='true' {...attributes} className={`sf-check-list ${className ? className : ''}`}>
      <span contentEditable={false} style={{ marginRight: 6 }}>
        <input type="checkbox" onChange={onChange} checked={checked} />
      </span>
      {children}
    </div>
  );
};

export default renderCheckListItem;
