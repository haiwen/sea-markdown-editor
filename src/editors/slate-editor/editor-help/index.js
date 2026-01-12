import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import EventBus from '../../../utils/event-bus';
import { EXTERNAL_EVENTS, INTERNAL_EVENTS } from '../../../constants/event-types';
import HotKeysHelper from '../../../containers/hotkeys-helper';
import ArticleInfo from '../../../containers/article-info';
import CommentPanel from '../../../containers/comment-panel';

import './style.css';

export default function EditorHelp({ children }) {
  const [isShowHelpInfo, setIsShowHelpInfo] = useState(false);
  const [isShowArticleInfo, setIsShowArticleInfo] = useState(false);
  const [isShowCommentPanel, setIsShowCommentPanel] = useState(false);

  const closeAllPanels = useCallback(() => {
    setIsShowHelpInfo(false);
    setIsShowArticleInfo(false);
    setIsShowCommentPanel(false);
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.RESIZE_ARTICLE);
  }, []);

  const updateArticleInfoState = useCallback((details) => {
    if (details === null) {
      setIsShowArticleInfo(false);
    } else {
      closeAllPanels();
      setIsShowArticleInfo(true);
    }
  }, [closeAllPanels]);

  const updateHelpInfoState = useCallback((state) => {
    if (isShowHelpInfo && state === false) {
      setIsShowHelpInfo(false);
    } else if (!isShowHelpInfo && state !== false) {
      closeAllPanels();
      setIsShowHelpInfo(true);
    }
  }, [isShowHelpInfo, closeAllPanels]);

  const updateCommentPanelState = useCallback((config) => {
    if (config === null) {
      setIsShowCommentPanel(false);
    } else {
      closeAllPanels();
      setIsShowCommentPanel(true);
    }
  }, [closeAllPanels]);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribeArticleInfo = eventBus.subscribe(EXTERNAL_EVENTS.ON_ARTICLE_INFO_TOGGLE, updateArticleInfoState);
    const unsubscribeHelpInfo = eventBus.subscribe(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE, updateHelpInfoState);
    const unsubscribeCommentPanel = eventBus.subscribe(EXTERNAL_EVENTS.ON_COMMENT_PANEL_TOGGLE, updateCommentPanelState);
    return () => {
      unsubscribeHelpInfo();
      unsubscribeArticleInfo();
      unsubscribeCommentPanel();
    };
  }, [updateArticleInfoState, updateHelpInfoState, updateCommentPanelState]);

  const containerClass = classNames('sf-markdown-help-wrapper', {
    'active': isShowArticleInfo || isShowHelpInfo || isShowCommentPanel
  });

  return (
    <div className={containerClass}>
      <ArticleInfo isVisible={isShowArticleInfo} />
      {isShowHelpInfo && <HotKeysHelper />}
      <CommentPanel isVisible={isShowCommentPanel} />
    </div>
  );
}
