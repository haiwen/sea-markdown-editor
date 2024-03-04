import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SimpleEditor } from '@seafile/seafile-editor';
import classNames from 'classnames';
import getPreviewContent from '../../utils/get-preview-content';
import { getBrowserInfo } from '../../utils/is-valid-browser';
import LongTextModal from './longtext-modal';
import BrowserTip from './browser-tip';
import MarkdownPreview from '../markdown-preview';

import './style.css';

export default function LongTextEditorDialog({
  lang,
  readOnly,
  headerName,
  value,
  autoSave = true,
  saveDelay = 6000,
  isCheckBrowser = false,
  editorApi,
  updateValue,
  onCloseEditorDialog,
  valueLimitCallback,
}) {
  const editorRef = useRef(null);
  const [isValueChanged, setValueChanged] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dialogStyle, setDialogStyle] = useState({});


  const onUpdateEditorValue = useCallback(() => {
    if (!isValueChanged) return;
    const markdownString = editorRef.current?.getValue();
    const isValueValid = valueLimitCallback && valueLimitCallback(markdownString);
    if (isValueValid) {
      const slateNodes = editorRef.current.getSlateNodes();
      const value = getPreviewContent(slateNodes);
      updateValue(value);
      setValueChanged(false);
    }
  }, [isValueChanged, updateValue, valueLimitCallback]);

  useEffect(() => {
    let timer = null;
    if (autoSave) {
      timer = setTimeout(() => {
        onUpdateEditorValue();
      }, saveDelay);
    }
    return () => {
      clearTimeout(timer);
    };

  }, [autoSave, saveDelay, onUpdateEditorValue]);

  const { isValidBrowser, isWindowsWechat } = useMemo(() => {
    return getBrowserInfo(isCheckBrowser);
  }, [isCheckBrowser]);

  const onCloseToggle = useCallback(() => {
    const value = editorRef.current?.getValue();
    if (isValueChanged) {
      updateValue(value);
    }
    onCloseEditorDialog();
  }, [isValueChanged, onCloseEditorDialog, updateValue]);

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
    setValueChanged(true);
  }, []);

  const onContainerKeyDown = (event) => {
    if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      onCloseToggle();
    }
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
          {(!readOnly && !isWindowsWechat) && (
            <SimpleEditor
              ref={editorRef}
              value={value}
              editorApi={editorApi}
              onContentChanged={onContentChanged}
            />
          )}
          {(readOnly || isWindowsWechat) && (
            <MarkdownPreview
              isWindowsWechat={isWindowsWechat}
              value={value}
              isShowOutline={false}
            />
          )}
        </div>
      </div>
    </LongTextModal>
  );
}

