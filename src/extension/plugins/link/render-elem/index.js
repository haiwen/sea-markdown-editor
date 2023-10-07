/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import LinkPopover from './link-popover';
import { getLinkInfo } from '../helper';
import EventBus from '../../../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../../../constants/event-types';

import './style.css';

const renderLink = ({ attributes, children, element }, editor) => {
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const onClosePopover = useCallback((e) => {
    unregisterClickEvent();
    setIsShowPopover(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPopoverPosition]);

  const registerClickEvent = useCallback(() => {
    document.addEventListener('click', onClosePopover);
  }, [onClosePopover]);

  const unregisterClickEvent = useCallback(() => {
    document.removeEventListener('click', onClosePopover);
  }, [onClosePopover]);

  const onOpenPopover = useCallback((e) => {
    e.stopPropagation();
    // Only one popover can be open at the same time, close other popover and update new popover controller function.
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.ON_CLOSE_LINK_POPOVER);
    eventBus.subscribe(INTERNAL_EVENTS.ON_CLOSE_LINK_POPOVER, () => setIsShowPopover(false));
    const linkInfo = getLinkInfo(editor);
    if (!linkInfo) return;
    const { top, left, width } = e.target.getBoundingClientRect();
    const popoverTop = top - 42;
    const popoverLeft = left - (140 / 2) + (width / 2);
    setPopoverPosition({ top: popoverTop, left: popoverLeft });
    setIsShowPopover(true);
    registerClickEvent();
  }, [editor, registerClickEvent]);

  return (
    <>
      <span
        onClick={onOpenPopover}
        className={classNames('sf-virtual-link', { selected: isShowPopover })}
        {...attributes}
      >
        {children}
      </span>
      {isShowPopover && (
        <LinkPopover
          onClosePopover={onClosePopover}
          linkUrl={element.url}
          popoverPosition={popoverPosition}
          editor={editor}
        />
      )}
    </>
  );
};

export default renderLink;
