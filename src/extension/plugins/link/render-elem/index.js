/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import LinkPopover from './link-popover';

import './style.css';

const renderLink = ({ attributes, children, element }, editor) => {
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const onClosePopover = useCallback((e) => {
    unRegisterClickEvent();
    setIsShowPopover(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPopoverPosition]);

  const onOpenPopover = (e) => {
    e.stopPropagation();
    const { top, left, width } = e.target.getBoundingClientRect();
    const popoverTop = top - 42;
    const popoverLeft = left - (140 / 2) + (width / 2);
    setPopoverPosition({ top: popoverTop, left: popoverLeft });
    setIsShowPopover(true);
    registerClickEvent();
  };

  const registerClickEvent = () => {
    document.addEventListener('click', onClosePopover);
  };

  const unRegisterClickEvent = () => {
    document.removeEventListener('click', onClosePopover);
  };

  return (
    <span className='link-wrapper'>
      <span
        onClick={onOpenPopover}
        className={classNames('virtual-link')}
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
    </span>
  );
};

export default renderLink;
