import React, { useCallback, useEffect, useRef } from 'react';
import { Node, Text } from 'slate';
import { useSelected, useSlate } from 'slate-react';
import { INTERNAL_EVENTS } from '../../../constants/event-types';
import EventBus from '../../../utils/event-bus';
import { findPath } from '../../core';

import './formula.css';

const getAdjacentText = (children, index, step) => {
  for (let i = index; i >= 0 && i < children.length; i += step) {
    const child = children[i];
    if (Text.isText(child) && !child.text) continue;
    return Node.string(child);
  }
  return '';
};

const getSpacingClasses = (editor, element) => {
  const path = findPath(editor, element);
  if (!path) return '';

  const { children } = Node.parent(editor, path);
  const index = path[path.length - 1];
  const before = getAdjacentText(children, index - 1, -1);
  const after = getAdjacentText(children, index + 1, 1);
  const startClass = /[\p{L}\p{N}]\p{M}*$/u.test(before) ? ' sf-formula-space-start' : '';
  const endClass = /^[\p{L}\p{N}]/u.test(after) ? ' sf-formula-space-end' : '';
  return startClass + endClass;
};

const Formula = ({ attributes, element, children }) => {

  const editor = useSlate();
  const isSelected = useSelected();
  const formulaContainerRef = useRef(null);

  useEffect(() => {
    const { formula = '' } = element.data || {};
    if (!formula) return;
    if (formulaContainerRef.current && window.MathJax) {
      formulaContainerRef.current.innerHTML = '';
      const dom = window.MathJax.tex2svg(formula, { display: !element.inline });
      formulaContainerRef.current.appendChild(dom);
    }
  }, [element]);

  const toggleFormulaEditor = useCallback(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.ON_OPEN_FORMULA_DIALOG, element);
  }, [element]);

  const className = element.inline ? 'sf-inline-formula' + getSpacingClasses(editor, element) : 'sf-block-formula';
  return (
    <span onDoubleClick={toggleFormulaEditor} className={className + (isSelected ? ' sf-selected-formula' : '')} {...attributes}>
      <span contentEditable={false} ref={formulaContainerRef}></span>
      <span contentEditable={false}>{children}</span>
    </span>
  );
};

const renderFormula = (props) => {
  return <Formula {...props} />;
};

export default renderFormula;
