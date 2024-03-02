import React, { useCallback, useRef, useState } from 'react';
import { SimpleEditor } from '@seafile/seafile-editor';
import classNames from 'classnames';
import LongTextModal from './longtext-modal';

import './style.css';

export default function LongTextEditorDialog({
  readOnly,
  headerName,
  value,
  updateValue,
  onCloseEditor,
  editorApi
}) {
  const editorRef = useRef(null);
  const [isValueChanged, setValueChanged] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dialogStyle, setDialogStyle] = useState({});

  const onContentChanged = useCallback(() => {
    setValueChanged(true);
  }, []);

  const onCloseToggle = useCallback(() => {
    const value = editorRef.current.getValue();
    if (isValueChanged) {
      updateValue(value);
    }
    onCloseEditor();
  }, [isValueChanged, onCloseEditor, updateValue]);

  const onFullScreenToggle = useCallback(() => {
    let containerStyle = {};
    if (!isFullScreen) {
      containerStyle = {
        width: '100%',
        height: '100%',
        top: 0,
        border: 'none'
      };
    }
    setIsFullScreen(!isFullScreen);
    setDialogStyle(containerStyle);
  }, [isFullScreen]);

  const onContainerKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      onCloseToggle();
    }
  };

  const headerClass = classNames('longtext-header-container', { 'longtext-header-container-border': readOnly });
  const contentClass = classNames('longtext-content-container', { 'longtext-container-scroll': readOnly });

  return (
    <LongTextModal onModalClick={onCloseToggle}>
      <div style={dialogStyle} className="longtext-dialog-container">
        <div className={headerClass}>
          <div className="longtext-header">
            <span className="longtext-header-name">{headerName}</span>
            <div className="longtext-header-tool">
              <span onClick={onFullScreenToggle} className={`longtext-header-tool-item mr-1 dtable-font dtable-icon-full-screen ${isFullScreen ? 'long-text-full-screen' : ''}`}></span>
              <span onClick={onCloseToggle} className="longtext-header-tool-item dtable-font dtable-icon-x"></span>
            </div>
          </div>
        </div>
        <div onKeyDown={onContainerKeyDown} className={contentClass}>
          <SimpleEditor
            ref={editorRef}
            value={value}
            editorApi={editorApi}
            onContentChanged={onContentChanged}
          />
        </div>
      </div>
    </LongTextModal>
  );
}

