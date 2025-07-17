import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UncontrolledPopover } from 'reactstrap';
import classNames from 'classnames';
import { focusEditor } from '../../../../core';
import { TRANSLATE_NAMESPACE } from '../../../../../constants';
import { changeColumnAlign } from '../../table-operations';

import './style.css';

const VerticalAlignPopover = ({ target, editor, readonly, verticalAlign }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const setVerticalAlignStyle = useCallback((verticalAlign) => {
    if (readonly) return;
    changeColumnAlign(editor, verticalAlign);
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
        <div className="sf-dropdown-menu-item" onMouseDown={() => setVerticalAlignStyle('top')}>
          <div className='sf-checked'><i className={classNames('iconfont icon-check-mark', { active: !verticalAlign || verticalAlign === 'top' })}></i></div>
          <span className='active'>{t('Top_align')}</span>
        </div>
        <div className="sf-dropdown-menu-item" onMouseDown={() => setVerticalAlignStyle('middle')}>
          <div className='sf-checked'><i className={classNames('iconfont icon-check-mark', { active: verticalAlign === 'middle' })}></i></div>
          <span>{t('Center_align')}</span>
        </div>
        <div className="sf-dropdown-menu-item" onMouseDown={() => setVerticalAlignStyle('bottom')}>
          <div className='sf-checked'><i className={classNames('iconfont icon-check-mark', { active: verticalAlign === 'bottom' })}></i></div>
          <span>{t('Bottom_align')}</span>
        </div>
      </div>
    </UncontrolledPopover>
  );
};

export default VerticalAlignPopover;
