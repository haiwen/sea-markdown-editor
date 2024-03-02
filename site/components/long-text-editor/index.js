import React, { useCallback, useRef, useState } from 'react';
import { SimpleEditor } from '@seafile/seafile-editor';
import LongTextModal from './longtext-modal';

import './style.css';

export default function LongTextEditor({ readOnly, headerName, value, updateValue, onCloseEditor }) {
  const editorRef = useRef(null);
  const [isValueChanged, setValueChanged] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dialogStyle, setDialogStyle] = useState({});

  const onContentChanged = useCallback(() => {
    setValueChanged(true);
  }, []);

  const onCloseToggle = useCallback(() => {
    const value = editorRef.current.getValue();
    console.log(isValueChanged);
    if (isValueChanged) {
      updateValue(value);
    }
    onCloseEditor();
  }, [isValueChanged, onCloseEditor, updateValue]);

  const onFullScreenToggle = useCallback(() => {
    setIsFullScreen(!isFullScreen);
  }, [isFullScreen]);

  const onContainerKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      onCloseToggle();
    }
  };

  return (
    <LongTextModal onModalClick={onCloseToggle}>
      <div style={dialogStyle} className="longtext-modal-dialog">
        <div className={`longtext-modal-dialog-header ${readOnly ? 'longtext-modal-dialog-header-border' : ''}`}>
          <div className="longtext-header">
            <span className="longtext-header-name">{headerName}</span>
            <div className="longtext-header-tool">
              <span onClick={onFullScreenToggle} className={`mr-1 longtext-header-tool-item dtable-font dtable-icon-full-screen ${isFullScreen ? 'long-text-full-screen' : ''}`}></span>
              <span onClick={onCloseToggle} className="longtext-header-tool-item dtable-font dtable-icon-x"></span>
            </div>
          </div>
        </div>
        <div onKeyDown={onContainerKeyDown} className={`longtext-container ${readOnly ? 'longtext-container-scroll' : ''}`}>
          <SimpleEditor
            ref={editorRef}
            value={value}
            onContentChanged={onContentChanged}
          />
        </div>
      </div>
    </LongTextModal>
  );
}

