import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import EventBus from '../../../utils/event-bus';
import { EXTERNAL_EVENTS, INTERNAL_EVENTS } from '../../../constants/event-types';
import HotKeysHelper from '../../../containers/hotkeys-helper';

import './style.css';

export default function SeafileHelp({ children }) {

  const [isShowHelpInfo, setIsShowHelpInfo] = useState(false);
  const [isShowArticleInfo, setIsShowArticleInfo] = useState(false);

  const updateArticleInfoState = useCallback((state) => {
    setIsShowArticleInfo(state);
    setIsShowHelpInfo(false);
  }, []);

  const updateHelpInfoState = useCallback(() => {
    const newState = !isShowHelpInfo;
    setIsShowHelpInfo(newState);
  }, [isShowHelpInfo]);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribeArticleInfo = eventBus.subscribe(INTERNAL_EVENTS.ON_ARTICLE_INFO_TOGGLE, updateArticleInfoState);
    const unsubscribeHelpInfo = eventBus.subscribe(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE, updateHelpInfoState);
    return () => {
      unsubscribeHelpInfo();
      unsubscribeArticleInfo();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerClass = classNames('sf-markdown-help-wrapper', {
    'active': isShowArticleInfo || isShowHelpInfo
  });

  return (
    <div className={containerClass}>
      {isShowArticleInfo && !isShowHelpInfo && children}
      {isShowHelpInfo && <HotKeysHelper />}
    </div>
  );
}
