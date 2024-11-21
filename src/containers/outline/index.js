import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import OutlineItem from './outline-item';
import { useScrollContext } from '../../hooks/use-scroll-context';
import { TRANSLATE_NAMESPACE } from '../../constants';
import EventBus from '../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../constants/event-types';

import './style.css';

export const getOutlineSetting = () => {
  const currentValue = localStorage.getItem('sf-editor');
  const config = currentValue ? JSON.parse(currentValue) : {};
  const { outlineOpen = false } = config;
  return outlineOpen;
};

export const setOutlineSetting = (isShown) => {
  const currentValue = localStorage.getItem('sf-editor');
  const config = currentValue ? JSON.parse(currentValue) : {};
  config['outlineOpen'] = isShown;
  localStorage.setItem('sf-editor', JSON.stringify(config));
};

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
  const [isShown, setIsShown] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const headerList = getHeaderList(editor.children);
    setHeaderList(headerList);
  }, [editor.children]);

  const updateOutlineState = useCallback((nextState) => {
    setOutlineSetting(nextState);
    setIsShown(nextState);
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.OUTLINE_STATE_CHANGED);
  }, []);

  const toggleShow = useCallback(() => {
    const nextState = !isShown;
    updateOutlineState(nextState);
  }, [isShown, updateOutlineState]);

  useEffect(() => {
    if (!scrollRef.current) return;

    const updateScrollLeft = () => {
      setScrollLeft(scrollRef.current.scrollLeft);
    };

    scrollRef.current.addEventListener('scroll', updateScrollLeft);

    return () => {
      scrollRef.current?.removeEventListener('scroll', updateScrollLeft);
    };
  }, [scrollRef]);

  useEffect(() => {
    const outlineState = getOutlineSetting();
    updateOutlineState(outlineState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classnames('sf-editor-outline-wrapper', { 'active': isShown })} style={{ left: -scrollLeft }}>
      <div className="sf-editor-outline" >
        {isShown && (
          <>
            <div className="sf-editor-outline-header">
              <h2 className="sf-editor-outline-header_title">{t('Outline')}</h2>
              <span className="sf-editor-outline-header_close iconfont icon-x" onClick={toggleShow}></span>
            </div>
            {headerList.length === 0 ? (
              <div className="empty-container">{t('No_outline')}</div>
            ) : (
              <div className="sf-editor-outline-list-container">
                {headerList.map((node, index) => (
                  <OutlineItem key={index} node={node} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {!isShown && (
        <span
          id="sf-editor-outline-menu"
          className="sf-editor-outline-menu sf-editor-tooltip iconfont icon-outline"
          onClick={toggleShow}
        >
          <span className="custom-tooltip">{t('Outline')}</span>
        </span>
      )}
    </div>
  );
};

Outline.propTypes = {
  editor: PropTypes.object,
};

export default Outline;
