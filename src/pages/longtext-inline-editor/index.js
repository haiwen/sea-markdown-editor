import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import ClickOutside from './click-outside';
import Formatter from './formatter';
import FallbackEditor from './fallback-editor';
import NormalEditor from './normal-editor';
import { mdStringToSlate } from '../../slate-convert';
import getBrowserInfo from '../../utils/get-browser-Info';
import { getNodePathById } from '../../extension';

import './index.css';

const LongTextInlineEditor = forwardRef(({
  autoSave,
  isCheckBrowser,
  saveDelay,
  value,
  lang,
  headerName,
  onPreviewClick,
  onSaveEditorValue,
  editorApi,
}, ref) => {
  const [isShowEditor, setShowEditor] = useState(false);
  const valueRef = useRef(typeof value === 'string' ? { text: value } : value);
  const longTextValueChangedRef = useRef(false);
  const [focusNodePath, setFocusNodePath] = useState([0, 0]);

  const { isWindowsWechat } = useMemo(() => {
    return getBrowserInfo(isCheckBrowser);
  }, [isCheckBrowser]);

  const openEditor = useCallback((focusNodePath = [0, 0]) => {
    setFocusNodePath(focusNodePath);
    setShowEditor(true);
  }, []);

  const closeEditor = useCallback(() => {
    if (longTextValueChangedRef.current) {
      onSaveEditorValue(valueRef.current);
    }
    setShowEditor(false);
  }, [longTextValueChangedRef, valueRef, onSaveEditorValue]);

  const getAttributeNode = useCallback((node, attribute, deep = 4) => {
    if (!node || !node.getAttribute) return null;
    if (deep === -1) return null;
    if (node.getAttribute(attribute)) return node.getAttribute(attribute);
    if (node.parentNode) return getAttributeNode(node.parentNode, attribute, deep--);
  }, []);

  const previewClick = useCallback((event, richValue) => {
    if (event.target.nodeName === 'A') return;
    const nodeId = getAttributeNode(event.target, 'data-id');
    onPreviewClick && onPreviewClick();
    openEditor(getNodePathById({ children: richValue }, nodeId));
  }, [onPreviewClick, openEditor, getAttributeNode]);

  const onEditorValueChanged = useCallback((value) => {
    valueRef.current = value;
    longTextValueChangedRef.current = true;
  }, []);

  const onHotKey = useCallback((event) => {
    const keyCode = event.keyCode;
    const isModP = isHotkey('mod+p', event);
    if (keyCode === 27 || isModP) {
      event.preventDefault();
      !isModP && event.stopPropagation();
      closeEditor();
      return;
    }
  }, [closeEditor]);

  useImperativeHandle(ref, () => {
    return {
      openEditor: openEditor,
      closeEditor: closeEditor,
    };
  }, [openEditor, closeEditor]);

  if (!isShowEditor) {
    const richValue = mdStringToSlate(valueRef.current.text);
    return (
      <div className="sf-long-text-inline-editor-container preview" onClick={(event) => previewClick(event, richValue)} >
        {valueRef.current.text && (<Formatter value={isWindowsWechat ? valueRef.current : richValue} />)}
      </div>
    );
  }

  return (
    <ClickOutside onClickOutside={closeEditor}>
      <div className="w-100" onKeyDown={onHotKey}>
        {isWindowsWechat ? (
          <FallbackEditor
            isShowEditor={isShowEditor}
            value={valueRef.current.text}
            onChange={onEditorValueChanged}
            closeEditor={closeEditor}
          />
        ) : (
          <NormalEditor
            lang={lang}
            headerName={headerName}
            focusNodePath={focusNodePath}
            value={valueRef.current.text}
            autoSave={autoSave}
            saveDelay={saveDelay}
            isCheckBrowser={isCheckBrowser}
            editorApi={editorApi}
            onSaveEditorValue={onSaveEditorValue}
            onEditorValueChanged={onEditorValueChanged}
          />
        )}
      </div>
    </ClickOutside>
  );
});

export default LongTextInlineEditor;
