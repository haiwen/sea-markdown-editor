import React, { useCallback, useEffect, useRef } from 'react';
import { useSelected } from 'slate-react';
import { INTERNAL_EVENTS } from '../../../constants/event-types';
import EventBus from '../../../utils/event-bus';

const Formula = ({ attributes, element, children }) => {

  const isSelected = useSelected();
  const formulaContainerRef = useRef(null);

  useEffect(() => {
    const { formula = '' } = element.data || {};
    if (!formula) return;
    const dom = window.MathJax.tex2svg(formula);
    if (formulaContainerRef.current) {
      formulaContainerRef.current.appendChild(dom);
    }
  }, [element]);

  const toggleFormulaEditor = useCallback(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.ON_OPEN_FORMULA_DIALOG, element);
  }, [element]);

  return (
    <div onDoubleClick={toggleFormulaEditor} className={'sf-block-formula ' + (isSelected ? ' selected-formula' : '')} {...attributes}>
      <span contentEditable={false} ref={formulaContainerRef}></span>
      <span contentEditable={false}>{children}</span>
    </div>
  );
};

const renderFormula = (props) => {
  return <Formula {...props} />;
};

export default renderFormula;
