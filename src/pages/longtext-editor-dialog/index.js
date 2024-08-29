import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import SimpleEditor from '../simple-editor';
import getPreviewContent from '../../utils/get-preview-content';
import getBrowserInfo from '../../utils/get-browser-Info';
import { LongTextModal, BrowserTip } from '../../components';
import MarkdownPreview from '../markdown-preview';

import '../longtext-editor-dialog/style.css';

export default function LongTextEditorDialog({
  lang,
  readOnly,
  headerName,
  value,
  autoSave = true,
  saveDelay = 60000,
  isCheckBrowser = false,
  isSupportInsertSeafileImage = false,
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

  const onContentChanged = useCallback(() => {
    // delay to update editor's content
    setTimeout(() => {
      // update parent's component cache value
      if (onEditorValueChanged && typeof onEditorValueChanged === 'function') {
        const markdownString = editorRef.current?.getValue();
        const slateNodes = editorRef.current?.getSlateValue();
        const { previewText, images, links, checklist } = getPreviewContent(slateNodes, false);
        onEditorValueChanged({ text: markdownString, preview: previewText, images: images, links: links, checklist });
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
      <div style={dialogStyle} className={classNames('longtext-dialog-container', className)}>
        <div className={headerClass}>
          <div className="longtext-header">
            <span className="longtext-header-name">{headerName}</span>
            <div className="longtext-header-tool">
              <span onClick={onFullScreenToggle} className={`longtext-header-tool-item mr-1 iconfont icon-full-screen ${isFullScreen ? 'long-text-full-screen' : ''}`}></span>
              <span onClick={onCloseToggle} className="longtext-header-tool-item iconfont icon-close"></span>
            </div>
          </div>
          {!isValidBrowser && <BrowserTip lang={lang} isWindowsWechat={isWindowsWechat} />}
        </div>
        <div onKeyDown={onContainerKeyDown} className={contentClass}>
          {(!readOnly && !isWindowsWechat) && (
            <SimpleEditor
              ref={editorRef}
              isSupportInsertSeafileImage={isSupportInsertSeafileImage}
              value={value}
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

