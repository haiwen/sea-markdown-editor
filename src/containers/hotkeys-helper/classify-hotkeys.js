import React from 'react';
import { isMac } from '../../utils/common';

export default function ClassifyHotkeys({ title, shortcutData, shortcutDataNames }) {
  return (
    <div className='sf-editor-classify-hotkeys'>
      <h5 className='hotkey-type'>{title}</h5>
      <ul className='hotkey-list'>
        {Object.keys(shortcutData).map(key => {
          const shortcutName = shortcutDataNames[key];
          let hotkeys = shortcutData[key];
          if (hotkeys.length !== 0) {
            hotkeys = hotkeys.length > 1 && isMac() ? hotkeys[1] : hotkeys[0];
          }
          return (
            <li className='hotkey-shortcuts' key={shortcutName}>
              <div className='hotkey-shortcuts-left'>
                {shortcutName}
              </div>
              <div className='hotkey-shortcuts-right'>
                {hotkeys[0] && <div className='key hotkey-first'>{hotkeys[0]}</div>}
                {hotkeys[1] && <div className='key hotkey-second'>{hotkeys[1]}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
