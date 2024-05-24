/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useState, useMemo } from 'react';
import classNames from 'classnames';
import { useReadOnly } from 'slate-react';
import LinkPopover from './link-popover';
import { getLinkInfo, isLinkType } from '../helper';
import EventBus from '../../../../utils/event-bus';
import { EXTERNAL_EVENTS, INTERNAL_EVENTS } from '../../../../constants/event-types';

import './style.css';

const renderLink = ({ attributes, children, element }, editor) => {
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const isReadonly = useReadOnly();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isLinkActive = useMemo(() => isLinkType(editor), [editor.selection]);

  const onClosePopover = useCallback((e) => {
    unregisterClickEvent();
    setIsShowPopover(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPopoverPosition]);

  const registerClickEvent = useCallback(() => {
    window.addEventListener('click', onClosePopover);
  }, [onClosePopover]);

  const unregisterClickEvent = useCallback(() => {
    window.removeEventListener('click', onClosePopover);
  }, [onClosePopover]);

  const onLinkClick = useCallback((e) => {
    e.stopPropagation();
    const eventBus = EventBus.getInstance();
    if (isReadonly) {
      if (editor.isInlineEditor) {
        window.open(element.url);
        return;
      }
      eventBus.dispatch(EXTERNAL_EVENTS.ON_LINK_CLICK, e);
      return;
    }
    // Only one popover can be open at the same time, close other popover and update new popover controller function.
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
  }, [editor, isReadonly, registerClickEvent, element]);

  const onHrefClick = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <>
      <span
        onClick={onLinkClick}
        data-url={element.url}
        className={classNames('sf-virtual-link', { selected: isShowPopover })}
        {...attributes}
      >
        <a href={element.url} onClick={onHrefClick}>{children}</a>
      </span>
      {isLinkActive && isShowPopover && (
        <LinkPopover
          popoverPosition={popoverPosition}
          linkUrl={element.url}
          editor={editor}
          onClosePopover={onClosePopover}
        />
      )}
    </>
  );
};

export default renderLink;
