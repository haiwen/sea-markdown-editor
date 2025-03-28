import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import SimpleEditor from '../simple-editor';
import getPreviewContent from '../../utils/get-preview-content';
import getBrowserInfo from '../../utils/get-browser-Info';
import { LongTextModal, BrowserTip } from '../../components';
import { slateToMdString } from '../../slate-convert';
import MarkdownPreview from '../markdown-preview';

import './style.css';

export default function LongTextEditorDialog({
  lang,
  readOnly,
  headerName,
  value,
  autoSave = true,
  saveDelay = 60000,
  focusEnd = false,
  isCheckBrowser = false,
  mathJaxSource,
  className,
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
    const markdownString = editorRef.current?.getValue();
    const slateNodes = editorRef.current?.getSlateValue();
    const { previewText, images, links, checklist } = getPreviewContent(slateNodes, false);
    onSaveEditorValue({ text: markdownString, preview: previewText, images: images, links: links, checklist });
    setValueChanged(false);
  }, [isValueChanged, onSaveEditorValue, readOnly]);

  const onCloseToggle = useCallback(() => {
    let value = null;
    if (!readOnly && isValueChanged) {
      const markdownString = editorRef.current?.getValue();
      const slateNodes = editorRef.current?.getSlateValue();
      const { previewText, images, links, checklist } = getPreviewContent(slateNodes, false);
      value = { text: markdownString, preview: previewText, images: images, links: links, checklist };
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

  const onContentChanged = useCallback((newContent) => {
    // update parent's component cache value
    if (typeof onEditorValueChanged === 'function') {
      const { previewText: preview, images, links, checklist } = getPreviewContent(newContent, false);
      onEditorValueChanged({ text: slateToMdString(newContent), preview, images, links, checklist });
    }
    setValueChanged(true);
  }, [onEditorValueChanged]);

  const onContainerKeyDown = (event) => {
    event.stopPropagation();
    onHotKey(event);
  };

  const headerClass = classNames('longtext-header-container', { 'longtext-header-container-border': (readOnly || isWindowsWechat) });
  const contentClass = classNames('longtext-content-container', { 'longtext-container-scroll': (readOnly || isWindowsWechat) });

  return (
    <LongTextModal onModalClick={onCloseToggle} containerClass={className}>
      <div style={dialogStyle} className="longtext-dialog-container">
        <div className={headerClass}>
          <div className="longtext-header">
            <span className="longtext-header-name">{headerName}</span>
            <div className="longtext-header-tool">
              <span onClick={onFullScreenToggle} className={`longtext-header-tool-item mr-1 iconfont icon-full-screen ${isFullScreen ? 'long-text-full-screen' : ''}`}></span>
              <span onClick={onCloseToggle} className="longtext-header-tool-item iconfont icon-x"></span>
            </div>
          </div>
          {!isValidBrowser && <BrowserTip lang={lang} isWindowsWechat={isWindowsWechat} />}
        </div>
        <div onKeyDown={onContainerKeyDown} className={contentClass}>
          {(!readOnly && !isWindowsWechat) && (
            <SimpleEditor
              ref={editorRef}
              value={value}
              focusEnd={focusEnd}
              editorApi={editorApi}
              mathJaxSource={mathJaxSource}
              onContentChanged={onContentChanged}
            />
          )}
          {(readOnly || isWindowsWechat) && (
            <MarkdownPreview
              isWindowsWechat={isWindowsWechat}
              value={value}
              mathJaxSource={mathJaxSource}
              isShowOutline={false}
            />
          )}
        </div>
      </div>
    </LongTextModal>
  );
}

