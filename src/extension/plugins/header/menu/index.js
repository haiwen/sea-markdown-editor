import React, { useState, useRef, Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { getHeaderType, isMenuDisabled, setHeaderType } from '../helper';
import Tooltip from '../../../commons/tooltip';
import { MAC_HOTKEYS_TIP_HEADER, WIN_HOTKEYS_EVENT_HEADER } from '../../../constants/keyboard';
import { ELementTypes, HEADERS, HEADER_TITLE_MAP } from '../../../constants';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

import './style.css';

const propTypes = {
  editor: PropTypes.object.isRequired,
  readonly: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

const headerPopoverShowerList = [ELementTypes.PARAGRAPH, ...HEADERS];

const HeaderMenu = ({ editor, readonly, isRichEditor }) => {
  const [isShowHeaderPopover, setIsShowHeaderPopover] = useState(false);
  const headerPopoverRef = useRef();
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const currentHeaderType = getHeaderType(editor);
  const isDisabled = isMenuDisabled(editor, readonly);

  const onHideHeaderMenu = useCallback((e) => {
    const menu = headerPopoverRef.current;
    const clickIsInMenu = menu && menu.contains(e.target) && menu !== e.target;
    if (clickIsInMenu) return;
    setIsShowHeaderPopover(false);
    unregisterEventHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerEventHandler = useCallback(() => {
    document.addEventListener('mousedown', onHideHeaderMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unregisterEventHandler = useCallback(() => {
    document.removeEventListener('mousedown', onHideHeaderMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();
    !isShowHeaderPopover ? registerEventHandler() : unregisterEventHandler();
    setIsShowHeaderPopover(!isShowHeaderPopover);
  };

  const onMouseDown = useCallback((type) => {
    setHeaderType(editor, type);
    setIsShowHeaderPopover(false);
    unregisterEventHandler();
  }, [editor, unregisterEventHandler]);

  const getToolTip = (type) => {
    // chrome in Mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (HTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
    const isMac = window.navigator.userAgent.indexOf('Macintosh') !== -1;
    return isMac ? MAC_HOTKEYS_TIP_HEADER[type] : WIN_HOTKEYS_EVENT_HEADER[type];
  };
  return (
    <div className={classnames('sf-header-menu', { 'header-popover-showed': isShowHeaderPopover, 'header-toggle-disabled': isDisabled })}>
      <div
        className={classnames('sf-header-toggle', { 'header-toggle-disabled': isDisabled, 'header-popover-showed': isShowHeaderPopover })}
        onClick={isDisabled ? void 0 : onToggleClick}
      >
        <span className='active'>{t(HEADER_TITLE_MAP[currentHeaderType ?? ELementTypes.PARAGRAPH])}</span>
        {!isDisabled && (<span className={`mdfont md-${isShowHeaderPopover ? 'arrow-up' : 'arrow-down'}`}></span>)}
      </div>
      {
        isShowHeaderPopover && (
          <div ref={headerPopoverRef} className='sf-header-popover'>
            {headerPopoverShowerList.map((item, index) => {
              const id = `${item}-${index}`;
              const isSelected = currentHeaderType === item;
              return (
                <Fragment key={index}>
                  <div
                    id={id}
                    className={classnames('sf-dropdown-menu-item', { 'position-relative': isSelected })}
                    onClick={() => onMouseDown(item)}
                  >
                    {isSelected && (<i className="mdfont md-check-mark"></i>)}
                    <span>{t(HEADER_TITLE_MAP[item])}</span>
                  </div>
                  <Tooltip
                    target={id}
                    placement="right"
                  >
                    {getToolTip(item)}
                  </Tooltip>
                </Fragment>
              );
            })}
          </div>
        )
      }
    </div >
  );
};

HeaderMenu.propTypes = propTypes;

export default HeaderMenu;
