import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import getBrowserInfo from '../../utils/get-browser-Info';
import { LongTextModal, BrowserTip } from '../../components';
import SeaTableEditor from '../seatable-editor';

import '../longtext-editor-dialog/style.css';

export default function EmailEditorDialog({
  lang,
  readOnly = false,
  headerName,
  value,
  columns,
  autoSave = false,
  saveDelay = 60000,
  isCheckBrowser = false,
  editorApi,
  onSaveEditorValue,
  onEditorValueChanged,
  onCloseEditorDialog
}) {
  const editorRef = useRef(null);
  const [isValueChanged, setValueChanged] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dialogStyle, setDialogStyle] = useState({});


  const onUpdateEditorValue = useCallback(() => {
    if (!isValueChanged || readOnly) return;
    const slateNodes = editorRef.current?.getSlateValue();
    onSaveEditorValue(slateNodes);
    setValueChanged(false);
  }, [isValueChanged, onSaveEditorValue, readOnly]);

  const onCloseToggle = useCallback(() => {
    let value = null;
    if (!readOnly && isValueChanged) {
      const slateNodes = editorRef.current?.getSlateValue();
      value = slateNodes;
    }
    onCloseEditorDialog(value);
  }, [isValueChanged, onCloseEditorDialog, readOnly]);

  const onHotKey = useCallback((event) => {
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      onCloseToggle();
    }
  }, [onCloseToggle]);

  useEffect(() => {
    let timer = null;
    if (autoSave) {
      timer = setTimeout(() => {
        onUpdateEditorValue();
      }, saveDelay);
    }
    document.addEventListener('keydown', onHotKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onHotKey);
    };

  }, [autoSave, saveDelay, onUpdateEditorValue, onHotKey]);

  const { isValidBrowser, isWindowsWechat } = useMemo(() => {
    return getBrowserInfo(isCheckBrowser);
  }, [isCheckBrowser]);

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

  const onContentChanged = useCallback(() => {
    // delay to update editor's content
    setTimeout(() => {
      // update parent's component cache value
      if (onEditorValueChanged && typeof onEditorValueChanged === 'function') {
        const slateNodes = editorRef.current?.getSlateValue();
        onEditorValueChanged(slateNodes);
      }
      setValueChanged(true);
    }, 0);
  }, [onEditorValueChanged]);

  const onContainerKeyDown = (event) => {
    event.stopPropagation();
    onHotKey(event);
  };

  const headerClass = classNames('longtext-header-container', { 'longtext-header-container-border': (readOnly || isWindowsWechat) });
  const contentClass = classNames('longtext-content-container', { 'longtext-container-scroll': (readOnly || isWindowsWechat) });

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
          {!isValidBrowser && <BrowserTip lang={lang} isWindowsWechat={isWindowsWechat} />}
        </div>
        <div onKeyDown={onContainerKeyDown} className={contentClass}>
          <SeaTableEditor
            ref={editorRef}
            value={value}
            columns={columns}
            editorApi={editorApi}
            onContentChanged={onContentChanged}
          />
        </div>
      </div>
    </LongTextModal>
  );
}

