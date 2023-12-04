import React, { useCallback, useEffect, useRef } from 'react';
import { useSelected } from 'slate-react';
import { INTERNAL_EVENTS } from '../../../constants/event-types';
import EventBus from '../../../utils/event-bus';

import './formula.css';

const Formula = ({ attributes, element, children }) => {

  const isSelected = useSelected();
  const formulaContainerRef = useRef(null);

  useEffect(() => {
    const { formula = '' } = element.data || {};
    if (!formula) return;
    if (formulaContainerRef.current && window.MathJax) {
      formulaContainerRef.current.innerHTML = '';
      const dom = window.MathJax.tex2svg(formula);
      formulaContainerRef.current.appendChild(dom);
    }
  }, [element]);

  const toggleFormulaEditor = useCallback(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.ON_OPEN_FORMULA_DIALOG, element);
  }, [element]);

  return (
    <span onDoubleClick={toggleFormulaEditor} className={'sf-block-formula ' + (isSelected ? ' sf-selected-formula' : '')} {...attributes}>
      <span contentEditable={false} ref={formulaContainerRef}></span>
      <span contentEditable={false}>{children}</span>
    </span>
  );
};

const renderFormula = (props) => {
  return <Formula {...props} />;
};

export default renderFormula;
