import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import ResizeWidth from './resize-width';
import EventBus from '../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../constants/event-types';
import './style.css';

const MIN_PANEL_WIDTH = 360;
const MAX_PANEL_WIDTH = 620;
const STORAGE_KEY = 'panelWidth';

const SidePanel = ({ isVisible, eventType }) => {
  const [width, setWidth] = useState(MIN_PANEL_WIDTH);
  const [config, setConfig] = useState({});

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

  const resizeWidth = useCallback((newWidth) => {
    if (newWidth >= MIN_PANEL_WIDTH && newWidth <= MAX_PANEL_WIDTH) {
      setWidth(newWidth);
    }
  }, []);

  const resizeWidthEnd = useCallback((newWidth) => {
    const settings = JSON.parse(window.localStorage.getItem('sf-editor') || '{}');
    window.localStorage.setItem('sf-editor', JSON.stringify({ ...settings, [STORAGE_KEY]: newWidth }));
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.RESIZE_ARTICLE);
  }, []);

  useEffect(() => {
    const settings = JSON.parse(window.localStorage.getItem('sf-editor') || '{}');
    const storedWidth = settings[STORAGE_KEY];
    const width = Math.max(MIN_PANEL_WIDTH, Math.min(parseInt(storedWidth, 10) || MIN_PANEL_WIDTH, MAX_PANEL_WIDTH));
    setWidth(width);
  }, []);

  const handleConfig = useCallback((configData) => {
    setConfig(configData);
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribePanel = eventBus.subscribe(eventType, handleConfig);
    return () => {
      unsubscribePanel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.RESIZE_ARTICLE);
  }, [isVisible, config]);

  const { component: panelComponent, props: panelProps } = config || {};
  return (
    <div className="sf-panel-wrapper" style={containerWrapperStyle}>
      <ResizeWidth minWidth={MIN_PANEL_WIDTH} maxWidth={MAX_PANEL_WIDTH} resizeWidth={resizeWidth} resizeWidthEnd={resizeWidthEnd} />
      <div className="sf-panel-container" style={{ width }}>
        {panelComponent && panelProps && React.createElement(panelComponent, { ...panelProps, width })}
      </div>
    </div>
  );
};

SidePanel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  eventType: PropTypes.string,
};

export default SidePanel;
