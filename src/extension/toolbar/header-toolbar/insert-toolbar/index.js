import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { UncontrolledPopover } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Tooltip from '../../../commons/tooltip';
import ImageMenu from '../../../plugins/image/menu';
import TableMenu from '../../../plugins/table/menu';
import CodeBlockMenu from '../../../plugins/code-block/menu';
import FormulaMenu from '../../../plugins/formula/menu';
import ColumnMenu from '../../../plugins/column/menu';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

import './style.css';

const InsertToolbar = ({
  isRichEditor = true,
  className = 'menu-group-item',
  editor,
  readonly,
  isSupportFormula,
  isSupportColumn,
  setIsShowInternetImageModal
}) => {
  const [isShowMenu, setMenuShow] = useState(false);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const popoverRef = useRef(null);
  const disabled = readonly;
  const insertButtonRef = useRef(null);
  const insertToolbarId = 'sf-insert-toolbar-btn';

  const toggle = useCallback((event) => {
    if (event?.target && event?.target?.tagName === 'INPUT') {
      return;
    }
    popoverRef.current && popoverRef.current.toggle();
    setMenuShow(!isShowMenu);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowMenu]);

  const validClassName = classnames(className, 'sf-menu-with-dropdown sf-insert-toolbar-btn', {
    'menu-show': isShowMenu,
    'disabled': disabled,
    'rich-icon-btn d-flex': isRichEditor,
    'rich-icon-btn-disabled': isRichEditor && disabled,
    'rich-icon-btn-hover': isRichEditor && !disabled,
    'btn btn-icon btn-secondary btn-active d-flex': !isRichEditor,
  });

  const caretIconClass = `sf-menu-with-dropdown-triangle-icon iconfont icon-${isShowMenu ? 'caret-up' : 'drop-down'}`;
  const { bottom } = insertButtonRef.current ? insertButtonRef.current.getBoundingClientRect() : { bottom: 92.5 };
  const props = {
    editor,
    readonly,
    toggle,
    setIsShowInternetImageModal,
  };

  return (
    <>
      <button type='button' className={validClassName} id={insertToolbarId} disabled={disabled} ref={insertButtonRef}>
        <div className='sf-menu-with-dropdown-icon'>
          <i className='iconfont icon-insert mr-1'></i>
          <span className='text-truncate'>{t('Insert')}</span>
        </div>
        <div className='sf-menu-with-dropdown-triangle'>
          <span className={caretIconClass}></span>
        </div>
      </button>
      <Tooltip target={insertToolbarId}>
        {t('Insert')}
      </Tooltip>
      {!disabled && (
        <UncontrolledPopover
          target={insertToolbarId}
          className='sf-menu-popover sf-dropdown-menu sf-insert-menu-popover'
          trigger='legacy'
          placement='bottom-start'
          hideArrow={true}
          toggle={toggle}
          fade={false}
          ref={popoverRef}
        >
          <div className='sf-insert-menu-container sf-dropdown-menu-container' style={{ maxHeight: window.innerHeight - bottom - 100 }}>
            <ImageMenu { ...props } />
            <TableMenu { ...props } />
            <CodeBlockMenu { ...props } />
            {isSupportFormula && <FormulaMenu { ...props } />}
            {isSupportColumn && <ColumnMenu { ...props } />}
          </div>
        </UncontrolledPopover>
      )}
    </>
  );

};

InsertToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default InsertToolbar;
