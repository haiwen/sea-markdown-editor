import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import ResizeWidth from './resize-width';
import EventBus from '../../utils/event-bus';
import { EXTERNAL_EVENTS, INTERNAL_EVENTS } from '../../constants/event-types';

import './style.css';

const MIN_PANEL_WIDTH = 360;
const MAX_PANEL_WIDTH = 620;

const ArticleInfo = ({ isVisible }) => {
  const [width, setWidth] = useState(MIN_PANEL_WIDTH);
  const [fileDetails, setFileDetails] = useState({});

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
    window.localStorage.setItem('sf-editor', JSON.stringify({ ...settings, panelWidth: width }));
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.RESIZE_ARTICLE);
  }, []);

  useEffect(() => {
    const settings = JSON.parse(window.localStorage.getItem('sf-editor', '{}')) || {};
    const { panelWidth } = settings;
    const width = Math.max(MIN_PANEL_WIDTH, Math.min(parseInt(panelWidth, 10) || MIN_PANEL_WIDTH, MAX_PANEL_WIDTH));
    setWidth(width);
  }, []);

  const handleFileDetails = useCallback((fileDetails) => {
    setFileDetails(fileDetails);
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribeArticleInfoDetail = eventBus.subscribe(EXTERNAL_EVENTS.ON_ARTICLE_INFO_TOGGLE, handleFileDetails);
    return () => {
      unsubscribeArticleInfoDetail();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.RESIZE_ARTICLE);
  }, [isVisible, fileDetails]);

  const { component: fileDetailsComponent, props: fileDetailsProps } = fileDetails || {};
  return (
    <div className="sf-article-info-container-wrapper" style={containerWrapperStyle}>
      <ResizeWidth minWidth={MIN_PANEL_WIDTH} maxWidth={MAX_PANEL_WIDTH} resizeWidth={resizeWidth} resizeWidthEnd={resizeWidthEnd} />
      <div className="sf-article-info-container" style={{ width }}>
        {fileDetailsComponent && React.createElement(fileDetailsComponent, { ...fileDetailsProps, width })}
      </div>
    </div>
  );
};

ArticleInfo.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default ArticleInfo;
