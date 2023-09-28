import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import EventBus from '../../../../utils/event-bus';
import { getLinkInfo, unWrapLinkNode } from '../helper';
import { isUrl } from '../../../../utils/common';

import './style.css';

const LinkPopover = ({ linkUrl, onClosePopover, popoverPosition, editor }) => {
  useEffect(() => {
    return () => {
      // unregister click event before unmount
      onClosePopover();
    };
  }, [onClosePopover]);

  const onLinkClick = (e) => {
    if (!isUrl(linkUrl)) {
      e.preventDefault();
    }
  };

  const onUnwrapLink = (e) => {
    e.stopPropagation();
    unWrapLinkNode(editor);
  };

  const onEditLink = (e) => {
    e.stopPropagation();
    const linkNode = getLinkInfo(editor);
    if (!linkNode) {
      onClosePopover();
      return;
    }
    const { linkTitle, linkUrl } = linkNode;
    const eventBus = EventBus.getInstance();
    eventBus.dispatch('openLinkModal', { linkTitle, linkUrl });
  };

  return (
    <>
      {createPortal(
        <div
          id="link-op-menu"
          className="link-op-menu"
          style={popoverPosition}
        >
          <a
            href={linkUrl}
            onClick={onLinkClick}
            target="_blank"
            rel="noopener noreferrer"
            className="link-op-menu-link">
            {linkUrl}
          </a>
          <div className="link-op-icons d-flex">
            <span role="button" className="link-op-icon" onClick={onEditLink}>
              <i className="iconfont icon-edit"></i>
            </span>
            <span role="button" className="link-op-icon" onClick={onUnwrapLink}>
              <i className="iconfont icon-delete"></i>
            </span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

LinkPopover.propTypes = {
  linkUrl: PropTypes.string.isRequired,
  popoverPosition: PropTypes.object.isRequired,
  onClosePopover: PropTypes.func.isRequired,
};

export default LinkPopover;
