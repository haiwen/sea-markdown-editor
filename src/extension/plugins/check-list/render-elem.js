/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

const renderCheckListItem = ({ attributes, children, element }) => {
  const editor = useSlate();
  const { id, checked = false } = element || {};

  const onChange = (event) => {
    const checked = event.target.checked;
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { checked }, { at: path });
  };
  return (
    <div data-id={id} data-root='true' {...attributes}>
      <span contentEditable={false} style={{ marginRight: 6 }}>
        <input type="checkbox" onChange={onChange} checked={checked} />
      </span>
      {children}
    </div>
  );
};

export default renderCheckListItem;
