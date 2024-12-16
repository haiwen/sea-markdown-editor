import { useCallback, useEffect, useState } from 'react';
import { getOutlineSetting } from '../containers/outline';
import { isMobile } from '../utils/common';
import EventBus from '../utils/event-bus';
import { INTERNAL_EVENTS } from '../constants/event-types';

const useContainerStyle = (scrollRef, isShowOutline = true) => {

  const [containerStyle, setContainerStyle] = useState({});

  // Adjust article container margin-left value according to isShown of the outline and width of window
  const handleWindowResize = useCallback(() => {
    const rect = scrollRef.current.getBoundingClientRect();
    const articleElement = document.querySelector('.article');
    const articleRect = articleElement ? articleElement.getBoundingClientRect() : null;
    const isOutlineShow = getOutlineSetting();
    if (isOutlineShow && articleRect && (rect.width - articleRect.width) / 2 < 280) {
      setContainerStyle({ marginLeft: 280 });
    } else {
      setContainerStyle({});
    }
  }, [scrollRef]);

  useEffect(() => {
    if (isMobile) return;
    if (!isShowOutline) return;
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    const eventBus = EventBus.getInstance();
    const unsubscribeOutline = eventBus.subscribe(INTERNAL_EVENTS.OUTLINE_STATE_CHANGED, handleWindowResize);
    const unsubscribeResizeArticle = eventBus.subscribe(INTERNAL_EVENTS.RESIZE_ARTICLE, handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      unsubscribeOutline();
      unsubscribeResizeArticle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    containerStyle
  };
};

export default useContainerStyle;
