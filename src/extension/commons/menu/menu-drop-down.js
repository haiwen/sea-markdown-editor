import React, { useRef, useState, Fragment, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tooltip from '../tooltip';
import { TRANSLATE_NAMESPACE } from '../../../constants';

const MenuDropDown = (props) => {
  const {
    readonly,
    className = '',
    isDisabled,
    dropDownList = [],
    id,
    text,
    iconClass,
    isShowMenuItemTooltip = false,
    isShowListItemIcon = false,
  } = props;

  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const menuItemRef = useRef();
  const menuDropdownRef = useRef();
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const containerId = useMemo(() => `menu-dropdown-${id}`, [id]);

  const handleHideDropDownList = useCallback((e) => {
    const isClickOnMenuItem = menuItemRef?.current?.contains(e.target);
    const isClickOnMenuDropdown = menuDropdownRef?.current?.contains(e.target);
    // If click on menu item, menu dropdown will show, and click on menu dropdown, menu dropdown will hide
    if (!isShowDropDown && isClickOnMenuItem && !isClickOnMenuDropdown) return;
    document.removeEventListener('click', handleHideDropDownList);
    setIsShowDropDown(false);
  }, [isShowDropDown]);

  const registerClickEvent = useCallback((e) => {
    setIsShowDropDown(true);
    document.addEventListener('click', handleHideDropDownList);
  }, [handleHideDropDownList]);

  const handleClickDropDownItem = useCallback((event, item, callback) => {
    event.stopPropagation();
    handleHideDropDownList(event);
    callback && callback(item);
  }, [handleHideDropDownList]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={menuItemRef}
        id={containerId}
        className={classnames(className, 'sf-menu-group-item sf-menu-with-dropdown', { 'header-popover-showed': isShowDropDown, 'header-toggle-disabled': isDisabled })}
        onClick={!readonly && !isDisabled && registerClickEvent}
      >
        <span className={`sf-menu-with-dropdown-icon active ${iconClass}`}></span>
        <div className='sf-menu-with-dropdown-triangle'>
          <i className={`sf-menu-with-dropdown-triangle-icon sdocfont sdoc-${isShowDropDown ? 'drop-down' : 'caret-up' }`}></i>
        </div>
        {
          !!isShowDropDown && (
            <div ref={menuDropdownRef} className='sf-dropdown-list '>
              {dropDownList.map((item, index) => {
                const { id, iconClass, handleClick, text } = item;
                return (
                  <Fragment key={index}>
                    <div
                      id={id}
                      className={classnames('sf-dropdown-list-item')}
                      onClick={(event) => handleClickDropDownItem(event, item, handleClick)}
                    >
                      {isShowListItemIcon && iconClass && <i className={`sf-dropdown-menu-item-icon ${iconClass}`}></i>}
                      <span className='sf-dropdown-menu-item-text'>{t(text)}</span>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          )
        }
        {!!isShowMenuItemTooltip && <Tooltip target={containerId} >{t(text)}</Tooltip>}
      </div>
    </div>
  );
};

MenuDropDown.propTypes = {
  readonly: PropTypes.bool.isRequired,
  className: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  dropDownList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    iconClass: PropTypes.string,
    handleClick: PropTypes.func,
  })),
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  isShowMenuItemTooltip: PropTypes.bool,
  isShowListItemIcon: PropTypes.bool,
};

export default MenuDropDown;
