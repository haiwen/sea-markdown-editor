import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useSlateStatic } from 'slate-react';
import ResizeWidth from './resize-width';
import EventBus from '../../utils/event-bus';
import { EXTERNAL_EVENTS } from '../../constants/event-types';

import './style.css';


const MIN_PANEL_WIDTH = 360;
const MAX_PANEL_WIDTH = 620;

const { fileName } = window.app.pageOptions;

export default function ArticleInfo({ children }) {
  const editor = useSlateStatic();
  const [width, setWidth] = useState(MIN_PANEL_WIDTH);
  const [isShown, setIsShown] = useState(true);

  const containerWrapperStyle = useMemo(() => {
    let style = {
      width, 
      zIndex: 101,
    };
    if (!style.width || style.width < MIN_PANEL_WIDTH) {
      style.width = MIN_PANEL_WIDTH;
    } else if (style.width > MAX_PANEL_WIDTH) {
      style.width = MAX_PANEL_WIDTH;
    }
    return style;
  }, [width]);

  const resizeWidth = useCallback((width) => {
    if (width >= MIN_PANEL_WIDTH && width <= MAX_PANEL_WIDTH) {
      setWidth(width);
    }
  }, []);

  const resizeWidthEnd = useCallback((width) => {
    const panelWidth = JSON.parse(window.localStorage.getItem('sf-editor-panel-width') || '{}');
    window.localStorage.setItem('sf-editor-panel-width', JSON.stringify({ ...panelWidth, width}));
    
  }, []);

  useEffect(() => {
    const panelWidth = JSON.parse(window.localStorage.getItem('sf-editor-panel-width', '{}')) || {};
    const width = Math.max(MIN_PANEL_WIDTH, Math.min(parseInt(panelWidth.width, 10) || MAX_PANEL_WIDTH, MAX_PANEL_WIDTH));
    setWidth(width);
  }, []);

  const onClose = () => {
    setIsShown(false);
  }

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const handleArticleInfoToggle = (state) => {
      setIsShown(state); 
    };

    const unsubscribeArticleInfo = eventBus.subscribe(EXTERNAL_EVENTS.ON_ARTICLE_INFO_TOGGLE, handleArticleInfoToggle);
    return () => {
      unsubscribeArticleInfo();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sf-article-info-container-wrapper" style={containerWrapperStyle}>
      <ResizeWidth minWidth={MIN_PANEL_WIDTH} maxWidth={MAX_PANEL_WIDTH} resizeWidth={resizeWidth} resizeWidthEnd={resizeWidthEnd} />
      {isShown && (
        <div className="sf-article-info-container">
          <div className="sf-article-info-nav nav">
            <div className="nav-item">
              <div className="iconfont icon-file"/>
              <span className="name ellipsis">{fileName}</span> 
            </div>  
            <div className="nav-control iconfont icon-x" onClick={onClose} />
          </div>
          <div className="sf-article-info-content">
              <>
                { children }
              </>
          </div>
        </div>
      )}
    </div>
  );
}
