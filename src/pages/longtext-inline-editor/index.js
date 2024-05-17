import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import ClickOutside from './click-outside';
import FallbackEditor from './fallback-editor';
import NormalEditor from './normal-editor';
import getBrowserInfo from '../../utils/get-browser-Info';

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
  const [focusRange, setFocusRange] = useState(null);

  const { isWindowsWechat } = useMemo(() => {
    return getBrowserInfo(isCheckBrowser);
  }, [isCheckBrowser]);

  const openEditor = useCallback((focusRange = null) => {
    setFocusRange(focusRange);
    setShowEditor(true);
  }, []);

  const closeEditor = useCallback(() => {
    if (longTextValueChangedRef.current) {
      onSaveEditorValue(valueRef.current);
    }
    setShowEditor(false);
  }, [longTextValueChangedRef, valueRef, onSaveEditorValue]);

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

  const updateFocus = useCallback((focusRange) => {
    onPreviewClick && onPreviewClick();
    openEditor(focusRange);
  }, [openEditor, onPreviewClick]);

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
            isShowEditor={isShowEditor}
            updateFocus={updateFocus}
            lang={lang}
            headerName={headerName}
            focusRange={focusRange}
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
