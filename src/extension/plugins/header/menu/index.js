import React, {  useState, useRef,  Fragment } from 'react'
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ELementTypes, HEADERS, HEADER_TITLE_MAP } from '../../../constants';
import { getHeaderType, isMenuDisabled, setHeaderType } from '../helper';
import { MAC_HOTKEYS, WIN_HOTKEYS } from '../../../constants/keyboard';
import { SDOC_FONT_SIZE } from '../../../constants/font';
import Tooltip from '../../../commons/tooltip'
import './style.css'


const propTypes = {
    className: PropTypes.string,
    editor: PropTypes.object,
};

const headerPopoverShowerList = [ELementTypes.PARAGRAPH, 'divider', ELementTypes.TITLE, ELementTypes.SUBTITLE, 'divider', ...HEADERS];


const HeaderMenu = (props) => {
    const { className, editor, readonly } = props
    const [isShowHeaderPopover, setIsShowHeaderPopover] = useState(false)
    const headerPopoverRef = useRef()
    const { t } = useTranslation()

    const currentHeaderType = getHeaderType(editor)
    const isDisabled = isMenuDisabled(editor, readonly)
    const getIsActive = (type) => { currentHeaderType === type }

    const registerEventHandler = () => {
        document.addEventListener('click', onHideHeaderMenu, true);
    }

    const unregisterEventHandler = () => {
        document.removeEventListener('click', onHideHeaderMenu, true);
    }

    const onHideHeaderMenu = (e) => {
        const menu = headerPopoverRef.current;
        const clickIsInMenu = menu && menu.contains(e.target) && menu !== e.target;
        if (clickIsInMenu) return;
        setIsShowHeaderPopover(false);
        unregisterEventHandler();
    }

    const onToggleClick = (event) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        setIsShowHeaderPopover((isShowHeaderPopover) => {
            const newIsShowHeaderPopover = !isShowHeaderPopover;
            newIsShowHeaderPopover ? registerEventHandler() : unregisterEventHandler();
            return newIsShowHeaderPopover;
        });
    }

    const onMouseDown = (type) => {
        return () => {
            const { editor } = props;
            const active = getIsActive(type);
            const newType = active ? ELementTypes.PARAGRAPH : type;
            setHeaderType(editor, newType);
            setIsShowHeaderPopover(false);
            unregisterEventHandler();
        };
    }


    const getToolTip = (type) => {
        //chrome in Mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
        const isMac = window.navigator.userAgent.indexOf('Macintosh') !== -1;
        return isMac ? MAC_HOTKEYS[type] : WIN_HOTKEYS[type];
    }
    return (
        <div className={classnames('header-menu', { 'header-popover-showed': isShowHeaderPopover, 'header-toggle-disabled': isDisabled })}>
            <div className={classnames('header-toggle', { 'header-toggle-disabled': isDisabled })} onClick={isDisabled ? void 0 : onToggleClick}>
                <span className='active'>{t(HEADER_TITLE_MAP[currentHeaderType])}</span>
                {!isDisabled && (<span className={`sdocfont sdoc-${isShowHeaderPopover ? 'caret-up' : 'drop-down'}`}></span>)}
            </div>
            {
                isShowHeaderPopover && (
                    <div ref={headerPopoverRef} className='header-popover sdoc-dropdown-menu'>
                        {headerPopoverShowerList.map((item, index) => {
                            if (item === 'divider') {
                                return (<div key={index} className='sdoc-dropdown-menu-divider'></div>);
                            }
                            const id = `${item}-${index}`;
                            const isSelected = currentHeaderType === item;
                            return (
                                <Fragment key={index}>
                                    <div
                                        id={id}
                                        className={classnames('sdoc-dropdown-menu-item', { 'position-relative': isSelected })}
                                        onClick={onMouseDown(item)}
                                    >
                                        {isSelected && (<i className="sdocfont sdoc-check-mark"></i>)}
                                        <span style={{ fontSize: `${SDOC_FONT_SIZE[item]}pt` }}>{t(HEADER_TITLE_MAP[item])}</span>
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
    )
}

HeaderMenu.propTypes = propTypes;

export default HeaderMenu