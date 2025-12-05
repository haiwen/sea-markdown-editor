import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ClassifyHotkeys from './classify-hotkeys';
import { HELPER_HOTKEYS } from '../../constants/hot-keys';
import { EXTERNAL_EVENTS } from '../../constants/event-types';
import EventBus from '../../utils/event-bus';
import { TRANSLATE_NAMESPACE } from '../../constants';

import './style.css';

export default function HotkeysHelper() {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const useHelp = t('userHelp', { returnObjects: true });
  const { title, userHelpData } = useHelp;

  const onCloseClick = useCallback(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE, false);
  }, []);

  return (
    <div className='sf-editor-helper'>
      <div className='sf-editor-helper__header'>
        <div className='title'>{title}</div>
        <div className="help-close" onClick={onCloseClick}><i className="mdfont md-sm-close"></i></div>
      </div>
      <div className='sf-editor-helper__content'>
        {userHelpData.map((item, index) => {
          const shortcutData = HELPER_HOTKEYS[index];
          const { shortcutType: title, shortcutData: shortcutDataNames } = item;

          return (
            <ClassifyHotkeys
              key={`use-hotkey-${index}`}
              title={title}
              shortcutData={shortcutData}
              shortcutDataNames={shortcutDataNames}
            />
          );
        })}
      </div>
    </div>
  );
}
