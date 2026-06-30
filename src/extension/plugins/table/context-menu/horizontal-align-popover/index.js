import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UncontrolledPopover } from 'reactstrap';
import classNames from 'classnames';
import { focusEditor } from '../../../../core';
import { TRANSLATE_NAMESPACE } from '../../../../../constants';
import { changeColumnAlign } from '../../table-operations';
import { getTableMenuBoundaryRect } from '../../helper';

import './style.css';

const HorizontalAlignPopover = ({ target, editor, readonly, horizontalAlign, handleCloseContextMenu }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const popoverRef = useRef(null);
  const [popoverClassName, setPopoverClassName] = useState('sf-table-alignment-popover');

  const setTextAlignStyle = useCallback((textAlign) => {
    if (readonly) return;
    changeColumnAlign(editor, textAlign);
    const focusPoint = editor.selection.focus;
    // prevent select all text in the editor
    focusEditor(editor, focusPoint);
    // Select last focus point
    setTimeout(() => {
      focusEditor(editor, focusPoint);
    }, 0);
    handleCloseContextMenu();
  }, [editor, handleCloseContextMenu, readonly]);

  useEffect(() => {
    const updatePlacement = () => {
      const popoverNode = popoverRef.current?._element;
      const targetNode = target?.current;
      if (!popoverNode || !targetNode) return;

      const boundaryRect = getTableMenuBoundaryRect(targetNode);
      const targetRect = targetNode.getBoundingClientRect();
      const popoverWidth = popoverNode.offsetWidth || 0;
      const gap = 8;
      const boundaryGap = 10;
      const canShowRight = targetRect.right + gap + popoverWidth <= boundaryRect.right - boundaryGap;
      const canShowLeft = targetRect.left - gap - popoverWidth >= boundaryRect.left + boundaryGap;

      if (!canShowRight && canShowLeft) {
        setPopoverClassName('sf-table-alignment-popover sf-table-alignment-popover-left');
        return;
      }

      setPopoverClassName('sf-table-alignment-popover');
    };

    const handleMouseEnter = () => {
      setTimeout(updatePlacement, 0);
    };

    updatePlacement();
    target?.current?.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('resize', updatePlacement);
    return () => {
      target?.current?.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', updatePlacement);
    };
  }, [target]);

  return (
    <UncontrolledPopover
      target={target.current}
      trigger="hover"
      placement="right-start"
      hideArrow={true}
      fade={false}
      offset={[0, 8]}
      popperClassName={`${popoverClassName} sf-popover-box-shadow`}
      innerRef={popoverRef}
    >
      <div className="sf-dropdown-menu sf-table-alignment-menu">
        <div className="sf-dropdown-menu-item" onMouseDown={() => setTextAlignStyle('left')}>
          <i className={classNames('mdfont md-check-mark', { active: !horizontalAlign || horizontalAlign === 'left' })}></i>
          <span className='active'>{t('Left')}</span>
        </div>
        <div className="sf-dropdown-menu-item" onMouseDown={() => setTextAlignStyle('center')}>
          <i className={classNames('mdfont md-check-mark', { active: horizontalAlign === 'center' })}></i>
          <span>{t('Center')}</span>
        </div>
        <div className="sf-dropdown-menu-item" onMouseDown={() => setTextAlignStyle('right')}>
          <i className={classNames('mdfont md-check-mark', { active: horizontalAlign === 'right' })}></i>
          <span>{t('Right')}</span>
        </div>
      </div>
    </UncontrolledPopover>
  );
};

export default HorizontalAlignPopover;
