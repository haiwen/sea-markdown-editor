import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { UncontrolledPopover } from 'reactstrap';
import { MENUS_CONFIG_MAP, MORE_OPERATION } from '../../constants';
import EventBus from '../../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../../constants/event-types';

import './index.css';

const MoreMenu = ({ className = 'sf-menu-group-item', disabled, isRichEditor = true, children }) => {
  const popoverRef = useRef(null);
  const imagePopoverRef = useRef(false);

  const validClassName = classnames(className, {
    'sf-rich-editor': isRichEditor,
    'sf-icon-btn': true,
    'sf-icon-btn-disabled': disabled,
    'sf-icon-btn-hover': !disabled,
  });
  const config = MENUS_CONFIG_MAP[MORE_OPERATION];

  const toggle = useCallback(() => {
    if (imagePopoverRef.current) return;
    popoverRef.current.toggle();
  }, []);

  const toggleImagePopover = useCallback((isPopoverShow) => {
    imagePopoverRef.current = isPopoverShow;
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribe = eventBus.subscribe(INTERNAL_EVENTS.ON_TOGGLE_IMAGE_POPOVER, toggleImagePopover);
    return () => unsubscribe();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button className={validClassName} type="button" id={config.id}>
        <i className={config.iconClass}></i>
      </button>
      <UncontrolledPopover
        target={config.id}
        className="sf-editor-menu-popover sf-editor--more-menu-popover"
        trigger="legacy"
        placement="bottom-end"
        hideArrow={true}
        fade={false}
        toggle={toggle}
        ref={popoverRef}
      >
        {children}
      </UncontrolledPopover>
    </>
  );
};

MoreMenu.propTypes = {
  disabled: PropTypes.bool,
  isRichEditor: PropTypes.bool,
  children: PropTypes.array.isRequired,
  classnames: PropTypes.string,
};

export default MoreMenu;
