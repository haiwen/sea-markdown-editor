import React from 'react';
import { useTranslation } from 'react-i18next';
import ClassifyHotkeys from './classify-hotkeys';
import { HELPER_HOTKEYS } from '../../constants/hot-keys';

import './style.css';

export default function HotkeysHelper() {
  const { t } = useTranslation();
  const useHelp = t('userHelp', { returnObjects: true });
  const { title, userHelpData } = useHelp;
  return (
    <div className='sf-editor-helper'>
      <div className='sf-editor-helper__header'>
        <div className='title'>{title}</div>
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
