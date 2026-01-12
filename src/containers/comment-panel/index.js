import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import ResizeWidth from '../article-info/resize-width';
import EventBus from '../../utils/event-bus';
import { EXTERNAL_EVENTS, INTERNAL_EVENTS } from '../../constants/event-types';
import '../article-info/style.css';

const MIN_PANEL_WIDTH = 360;
const MAX_PANEL_WIDTH = 620;

const CommentPanel = ({ isVisible }) => {
  const [width, setWidth] = useState(MIN_PANEL_WIDTH);
  const [commentConfig, setCommentConfig] = useState({});

  const containerWrapperStyle = useMemo(() => {
    const style = {
      width,
      zIndex: 101,
      display: isVisible ? 'block' : 'none',
    };
    if (!style.width || style.width < MIN_PANEL_WIDTH) {
      style.width = MIN_PANEL_WIDTH;
    } else if (style.width > MAX_PANEL_WIDTH) {
      style.width = MAX_PANEL_WIDTH;
    }
    return style;
  }, [width, isVisible]);

  const resizeWidth = useCallback((width) => {
    if (width >= MIN_PANEL_WIDTH && width <= MAX_PANEL_WIDTH) {
      setWidth(width);
    }
  }, []);

  const resizeWidthEnd = useCallback((width) => {
    const settings = JSON.parse(window.localStorage.getItem('sf-editor') || '{}');
    window.localStorage.setItem('sf-editor', JSON.stringify({ ...settings, commentPanelWidth: width }));
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.RESIZE_ARTICLE);
  }, []);

  useEffect(() => {
    const settings = JSON.parse(window.localStorage.getItem('sf-editor', '{}')) || {};
    const { commentPanelWidth } = settings;
    const width = Math.max(MIN_PANEL_WIDTH, Math.min(parseInt(commentPanelWidth, 10) || MIN_PANEL_WIDTH, MAX_PANEL_WIDTH));
    setWidth(width);
  }, []);

  const handleCommentConfig = useCallback((config) => {
    setCommentConfig(config);
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribeCommentPanel = eventBus.subscribe(EXTERNAL_EVENTS.ON_COMMENT_PANEL_TOGGLE, handleCommentConfig);
    return () => {
      unsubscribeCommentPanel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.RESIZE_ARTICLE);
  }, [isVisible, commentConfig]);

  const { component: commentComponent, props: commentProps } = commentConfig || {};
  return (
    <div className="sf-comment-panel-wrapper sf-panel-wrapper" style={containerWrapperStyle}>
      <ResizeWidth minWidth={MIN_PANEL_WIDTH} maxWidth={MAX_PANEL_WIDTH} resizeWidth={resizeWidth} resizeWidthEnd={resizeWidthEnd} />
      <div className="sf-comment-panel-container sf-panel-container" style={{ width }}>
        {commentComponent && commentProps && React.createElement(commentComponent, { ...commentProps, width })}
      </div>
    </div>
  );
};

CommentPanel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default CommentPanel;
