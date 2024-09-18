import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import OutlineItem from './outline-item';
import { useScrollContext } from '../../hooks/use-scroll-context';
import { TRANSLATE_NAMESPACE } from '../../constants';
import EventBus from '../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../constants/event-types';

import './style.css';

const getHeaderList = (children) => {
  const headerList = [];
  children.forEach((node) => {
    if (node.type === 'header2' || node.type === 'header3') {
      headerList.push(node);
    }
  });
  return headerList;
};

const Outline = ({ editor }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const scrollRef = useScrollContext();
  const [headerList, setHeaderList] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isShown, setIsShown] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const headerList = getHeaderList(editor.children);
    setHeaderList(headerList);
  }, [editor.children]);

  const handleScroll = useCallback((e) => {
    const scrollTop = scrollRef.current.scrollTop;
    const styles = getComputedStyle(scrollRef?.current);
    const paddingTop = parseInt(styles.paddingTop);
    for (let i = 0; i < headerList.length; i++) {
      const headerItem = headerList[i];
      const dom = document.getElementById(headerItem.id);
      const { offsetTop, offsetHeight } = dom;
      const styles = getComputedStyle(dom);
      const marginTop = parseInt(styles.marginTop);
      if (offsetTop + offsetHeight + marginTop > scrollTop - paddingTop) {
        setActiveId(headerItem.id);
        break;
      }
    }
  }, [headerList, scrollRef]);

  useEffect(() => {
    let observerRefValue = null;
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
      observerRefValue = scrollRef.current;
    }

    return () => {
      observerRefValue.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, scrollRef]);

  const toggleShow = useCallback(() => {
    setIsShown(prevIsShown => {
      const newIsShown = !prevIsShown;
      setTimeout(() => {
        const eventBus = EventBus.getInstance();
        eventBus.dispatch(INTERNAL_EVENTS.OUTLINE_STATE_CHANGED, newIsShown);
      }, 0);
      return newIsShown;
    });
  }, []);

  useEffect(() => {
    const updateScrollLeft = () => {
      setScrollLeft(window.scrollX); 
    };
    window.addEventListener('scroll', updateScrollLeft);
    return () => {
      window.removeEventListener('scroll', updateScrollLeft);
    };
  }, []);

  return (
    <div className="sf-editor-outline" style={{ left: -scrollLeft }}>
      {isShown && (
        <>
          <div className="sf-editor-outline-header">
            <h2 className="sf-editor-outline-header_title">{t('Outline')}</h2>
            <span className="sf-editor-outline-header_close iconfont icon-x" onClick={toggleShow}></span>
          </div>
          {headerList.length === 0 && (
            <div className="empty-container">{t('No_outline')}</div>
          )}
          {headerList.length > 0 && (
            <div className="sf-editor-outline-list-container">
              {headerList.map((node, index) => {
              return <OutlineItem key={index} node={node} activeId={activeId} />;
              })}
            </div>
        )}
        </>
      )}
      {!isShown && (
        <>
          <span
            id="sf-editor-outline-menu"
            className="sf-editor-outline-menu sf-edito-tooltip iconfont icon-outline"
            onClick={toggleShow}
          >
            <span className="custom-tooltip">{t('Outline')}</span>
          </span>
        </>
      )}
    </div>
  );
};

Outline.propTypes = {
  editor: PropTypes.object,
};

export default Outline;
