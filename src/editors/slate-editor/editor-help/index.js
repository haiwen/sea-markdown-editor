import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import EventBus from '../../../utils/event-bus';
import { EXTERNAL_EVENTS, INTERNAL_EVENTS } from '../../../constants/event-types';
import HotKeysHelper from '../../../containers/hotkeys-helper';
import ArticleInfo from '../../../containers/article-info';

import './style.css';

export default function EditorHelp({ children }) {

  const [isShowHelpInfo, setIsShowHelpInfo] = useState(false);
  const [isShowArticleInfo, setIsShowArticleInfo] = useState(false);

  const updateArticleInfoState = useCallback(() => {
    setIsShowArticleInfo(prevState => !prevState);
    setIsShowHelpInfo(false);
  }, []);

  const updateHelpInfoState = useCallback((state) => {
    setIsShowHelpInfo(state);
    setIsShowArticleInfo(false);
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.RESIZE_ARTICLE);
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribeArticleInfo = eventBus.subscribe(EXTERNAL_EVENTS.ON_ARTICLE_INFO_TOGGLE, updateArticleInfoState);
    const unsubscribeHelpInfo = eventBus.subscribe(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE, updateHelpInfoState);
    return () => {
      unsubscribeHelpInfo();
      unsubscribeArticleInfo();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateArticleInfoState, updateHelpInfoState]);

  const containerClass = classNames('sf-markdown-help-wrapper', {
    'active': isShowArticleInfo || isShowHelpInfo
  });

  return (
    <div className={containerClass}>
      <ArticleInfo isVisible={isShowArticleInfo} />
      {isShowHelpInfo && <HotKeysHelper />}
    </div>
  );
}
