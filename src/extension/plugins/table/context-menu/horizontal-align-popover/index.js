import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UncontrolledPopover } from 'reactstrap';
import classNames from 'classnames';
import { focusEditor } from '../../../../core';
import { TRANSLATE_NAMESPACE } from '../../../../../constants';
import { changeColumnAlign } from '../../table-operations';

import './style.css';

const HorizontalAlignPopover = ({ target, editor, readonly, horizontalAlign }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

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
  }, [editor, readonly]);

  return (
    <UncontrolledPopover
      target={target.current}
      trigger="hover"
      placement="right-start"
      hideArrow={true}
      fade={false}
    >
      <div className="sf-dropdown-menu sf-table-alignment-menu">
        <div className="sf-dropdown-menu-item" onMouseDown={() => setTextAlignStyle('left')}>
          <div className='sf-checked'><i className={classNames('mdfont md-check-mark', { active: !horizontalAlign || horizontalAlign === 'left' })}></i></div>
          <span className='active'>{t('Left')}</span>
        </div>
        <div className="sf-dropdown-menu-item" onMouseDown={() => setTextAlignStyle('center')}>
          <div className='sf-checked'><i className={classNames('mdfont md-check-mark', { active: horizontalAlign === 'center' })}></i></div>
          <span>{t('Center')}</span>
        </div>
        <div className="sf-dropdown-menu-item" onMouseDown={() => setTextAlignStyle('right')}>
          <div className='sf-checked'><i className={classNames('mdfont md-check-mark', { active: horizontalAlign === 'right' })}></i></div>
          <span>{t('Right')}</span>
        </div>
      </div>
    </UncontrolledPopover >
  );
};

export default HorizontalAlignPopover;
