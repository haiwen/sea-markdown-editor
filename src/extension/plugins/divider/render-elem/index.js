/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useSelected } from 'slate-react';

import './index.css';

const renderDivider = ({ attributes, children, element}) => {
  const isSelected = useSelected();

  return (
      <div
        data-id={element.id}
        className={`sf-divider-container ${isSelected ? 'is-selected' : ''}`}
        {...attributes}
      >
        <div className="sf-divider" contentEditable={false}></div>
        {children}
      </div>
  );
};

export default renderDivider;
