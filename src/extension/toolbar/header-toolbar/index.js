import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EXTERNAL_EVENTS, INTERNAL_EVENTS } from '../../../constants/event-types';
import useSelectionUpdate from '../../../hooks/use-selection-update';
import EventBus from '../../../utils/event-bus';
import { MenuGroup } from '../../commons';
import QuoteMenu from '../../plugins/blockquote/menu';
import HeaderMenu from '../../plugins/header/menu';
import TextStyleMenu from '../../plugins/text-style/menu';
import { TEXT_STYLE_MAP } from '../../constants';

import './style.css';

const Toolbar = ({ editor, readonly = false }) => {
  useSelectionUpdate();

  const [isShowArticleInfo, setIsShowArticleInfo] = useState(false);
  const updateArticleInfoState = useCallback(() => {
    const newState = !isShowArticleInfo;
    setIsShowArticleInfo(newState);
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.ON_ARTICLE_INFO_TOGGLE, newState);
  }, [isShowArticleInfo]);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    // Trigger external events and close article info
    const unsubscribeHelpInfo = eventBus.subscribe(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE, setIsShowArticleInfo);
    return () => {
      unsubscribeHelpInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sideIconClass = classNames('iconfont', {
    'icon-angle-double-left': !isShowArticleInfo,
    'icon-angle-double-right': isShowArticleInfo,
  });


  return (
    <div className='sf-markdown-editor-toolbar'>
      <MenuGroup></MenuGroup>
      <MenuGroup >
        <HeaderMenu editor={editor} readonly={readonly} />
      </MenuGroup>
      <MenuGroup >
        <TextStyleMenu editor={editor} readonly={readonly} type={TEXT_STYLE_MAP.BOLD} />
        <TextStyleMenu editor={editor} readonly={readonly} type={TEXT_STYLE_MAP.ITALIC} />
        <TextStyleMenu editor={editor} readonly={readonly} type={TEXT_STYLE_MAP.CODE} />
      </MenuGroup>
      <MenuGroup>
        <QuoteMenu editor={editor} readonly={readonly} />
      </MenuGroup>
      <div className='sf-markdown-article-info-control' onClick={updateArticleInfoState}>
        <span className={sideIconClass}></span>
      </div>
    </div>
  );
};

Toolbar.defaultProps = {
  readonly: false,
};

Toolbar.propTypes = {
  readonly: PropTypes.bool,
  editor: PropTypes.object,
};

export default Toolbar;
