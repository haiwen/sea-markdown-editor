import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import ClickOutside from './click-outside';
import FallbackEditor from './fallback-editor';
import NormalEditor from './normal-editor';
import getBrowserInfo from '../../utils/get-browser-Info';
import { KeyCodes } from '../../constants';

import './index.css';

const LongTextInlineEditor = forwardRef(({
  isAlwaysEnableEdit = false,
  defaultAutoFocus = true,
  autoSave,
  isCheckBrowser,
  saveDelay,
  value,
  lang,
  headerName,
  isImageUploadOnly = true,
  isSupportMultipleFiles = false,
  onClick,
  onSaveEditorValue,
  editorApi,
}, ref) => {
  const [enableEdit, setEnableEdit] = useState(isAlwaysEnableEdit);
  const valueRef = useRef(typeof value === 'string' ? { text: value } : value);

  const longTextValueChangedRef = useRef(false);
  const editorRef = useRef(null);

  const { isWindowsWechat } = useMemo(() => {
    return getBrowserInfo(isCheckBrowser);
  }, [isCheckBrowser]);

  const openEditor = useCallback(() => {
    if (isAlwaysEnableEdit) return;
    setEnableEdit(true);
  }, [isAlwaysEnableEdit]);

  const closeEditor = useCallback(() => {
    if (longTextValueChangedRef.current) {
      onSaveEditorValue(valueRef.current);
    }
    if (!isAlwaysEnableEdit) {
      setEnableEdit(false);
    }
  }, [isAlwaysEnableEdit, longTextValueChangedRef, valueRef, onSaveEditorValue]);

  const onEditorValueChanged = useCallback((value) => {
    valueRef.current = value;
    longTextValueChangedRef.current = true;
    if (isAlwaysEnableEdit) {
      onSaveEditorValue(valueRef.current);
    }
  }, [isAlwaysEnableEdit, onSaveEditorValue]);

  const onHotKey = useCallback((event) => {
    if (!enableEdit) return;
    const keyCode = event.keyCode;
    const isModP = isHotkey('mod+p', event);
    if (keyCode === KeyCodes.Esc || isModP) {
      event.preventDefault();
      !isModP && event.stopPropagation();
      closeEditor();
      return;
    }
  }, [enableEdit, closeEditor]);

  useImperativeHandle(ref, () => {
    return {
      enableEdit: enableEdit,
      openEditor: openEditor,
      closeEditor: closeEditor,
      getEditor: editorRef.current?.getEditor || (() => null),
    };
  }, [enableEdit, openEditor, closeEditor, editorRef]);

  const handelEnableEdit = useCallback(() => {
    onClick && onClick();
    openEditor();
  }, [openEditor, onClick]);

  return (
    <ClickOutside onClickOutside={closeEditor}>
      <div className="w-100" onKeyDown={onHotKey}>
        {isWindowsWechat ? (
          <FallbackEditor
            ref={editorRef}
            enableEdit={enableEdit}
            value={valueRef.current.text}
            onChange={onEditorValueChanged}
            closeEditor={closeEditor}
          />
        ) : (
          <NormalEditor
            ref={editorRef}
            enableEdit={enableEdit}
            handelEnableEdit={handelEnableEdit}
            lang={lang}
            headerName={headerName}
            value={valueRef.current.text}
            autoSave={autoSave}
            saveDelay={saveDelay}
            isCheckBrowser={isCheckBrowser}
            isImageUploadOnly={isImageUploadOnly}
            isSupportMultipleFiles={isSupportMultipleFiles}
            defaultAutoFocus={defaultAutoFocus}
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
