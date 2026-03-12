import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EventBus from '../../../../utils/event-bus';
import { getLinkInfo, unWrapLinkNode } from '../helper';
import { INTERNAL_EVENTS, EXTERNAL_EVENTS } from '../../../../constants/event-types';
import { TRANSLATE_NAMESPACE } from '../../../../constants';

const LinkPopover = ({ linkUrl, onClosePopover, popoverPosition, editor }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  useEffect(() => {
    return () => {
      // unregister click event before unmount
      onClosePopover();
    };
  }, [onClosePopover]);

  const onLinkClick = useCallback((event) => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.ON_LINK_CLICK, event, editor._id);
    onClosePopover();
  }, [editor, onClosePopover]);

  const onUnwrapLink = useCallback((e) => {
    e.stopPropagation();
    unWrapLinkNode(editor);
  }, [editor]);

  const onEditLink = useCallback((e) => {
    e.stopPropagation();
    const linkNode = getLinkInfo(editor);
    if (!linkNode) {
      onClosePopover();
      return;
    }
    const { linkTitle, linkUrl } = linkNode;
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.ON_OPEN_LINK_MODAL, { linkTitle, linkUrl });
    onClosePopover();
  }, [editor, onClosePopover]);

  return (
    <>
      {createPortal(
        <div
          id="link-op-menu"
          className="sf-link-op-menu"
          style={popoverPosition}
        >
          <span
            data-url={linkUrl}
            onClick={onLinkClick}
            className="sf-link-op-menu-link"
          >
            {t('Open_link')}
          </span>
          <div className="sf-link-op-icons d-flex ">
            <span role="button" className="sf-link-op-icon" onClick={onEditLink}>
              <i className="mdfont md-rename"></i>
            </span>
            <span role="button" className="sf-link-op-icon" onClick={onUnwrapLink}>
              <i className="mdfont md-unlink"></i>
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
