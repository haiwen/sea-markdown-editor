/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback } from 'react';
import { getNodesByType } from '../../../core';
import { DEFINITION } from '../../../constants/element-types';

import './index.css';

const renderLinkReference = ({ attributes, children, element }, editor) => {

  const onClick = useCallback(() => {
    const doms = getNodesByType(editor.children, DEFINITION);
    const dom = doms.find(d => d.identifier === element.identifier);
    if (!dom) return;
    const selector = `[data-id="${dom.id}"]`;
    const definitionDom = document.querySelector(selector);
    if (!definitionDom) return;
    definitionDom.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [element, editor]);

  return (
    <sup
      onClick={onClick}
      className="sf-virtual-link-reference"
      data-id={element.id}
      {...attributes}
      title={element.label}
    >
      {`[${element.identifier}]`}
    </sup>
  );
};

export default renderLinkReference;
