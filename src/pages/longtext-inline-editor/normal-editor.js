import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SimpleEditor from '../simple-editor';
import getPreviewContent from '../../utils/get-preview-content';
import MarkdownPreview from '../markdown-preview';
import LongTextEditorDialog from '../longtext-editor-dialog';
import { slateToMdString } from '../../slate-convert';

const NormalEditor = ({
  enableEdit,
  handelEnableEdit,
  lang,
  headerName,
  value: propsValue,
  autoSave = true,
  saveDelay = 60000,
  isCheckBrowser = false,
  isImageUploadOnly = true,
  isSupportMultipleFiles = false,
  editorApi,
  onSaveEditorValue,
  onEditorValueChanged,
}) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [style, setStyle] = useState({});
  const [showExpandEditor, setShowExpandEditor] = useState(false);
  const valueRef = useRef(typeof propsValue === 'string' ? { text: propsValue } : propsValue);
  const valueChangedRef = useRef(false);

  const saveValue = useCallback((value, save = false) => {
    valueChangedRef.current = true;
    onEditorValueChanged && onEditorValueChanged(value);
    if (!save) return;
    onSaveEditorValue && onSaveEditorValue(value);
    valueChangedRef.current = false;
  }, [onSaveEditorValue, onEditorValueChanged]);

  const handelAutoSave = useCallback(() => {
    if (!valueChangedRef.current) return;
    saveValue(valueRef.current, true);
  }, [saveValue]);

  const onContentChanged = useCallback((content) => {
    const { previewText: preview, images, links, checklist } = getPreviewContent(content, false);
    valueRef.current = { text: slateToMdString(content), preview, images, links, checklist };
    saveValue(valueRef.current);
  }, [saveValue]);

  const openEditorDialog = useCallback(() => {
    const { height } = editorContainerRef.current.getBoundingClientRect();
    setStyle({ height });
    setShowExpandEditor(true);
  }, [editorContainerRef]);

  const onCloseEditorDialog = useCallback((value) => {
    if (value) {
      valueRef.current = value;
      saveValue(value, true);
    }
    setStyle({});
    setShowExpandEditor(false);
  }, [saveValue]);

  useEffect(() => {
    let timer = null;
    if (autoSave) {
      timer = setTimeout(() => {
        handelAutoSave();
      }, saveDelay);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [autoSave, saveDelay, handelAutoSave]);

  if (!enableEdit && !valueRef.current.text) {
    return (
      <div className={classNames('sf-long-text-inline-editor-container', { 'preview': !enableEdit })} ref={editorContainerRef} onClick={handelEnableEdit}>
      </div>
    );
  }

  return (
    <>
      <div className={classNames('sf-long-text-inline-editor-container', { 'preview': !enableEdit })} style={style} ref={editorContainerRef}>
        {!showExpandEditor ? (
          <SimpleEditor
            ref={editorRef}
            enableEdit={enableEdit}
            isInline={true}
            isImageUploadOnly={isImageUploadOnly}
            isSupportMultipleFiles={isSupportMultipleFiles}
            value={valueRef.current.text}
            handelEnableEdit={handelEnableEdit}
            onSave={handelAutoSave}
            editorApi={editorApi}
            onContentChanged={onContentChanged}
            onExpandEditorToggle={openEditorDialog}
          />
        ) : (
          <div className="sf-simple-slate-editor-container">
            <div className="sf-slate-editor-toolbar"></div>
            <div className="sf-slate-editor-content">
              <MarkdownPreview
                value={valueRef.current.text}
                isShowOutline={false}
              />
            </div>
          </div>
        )}
      </div>
      {showExpandEditor && (
        <LongTextEditorDialog
          lang={lang}
          readOnly={false}
          isImageUploadOnly={isImageUploadOnly}
          isSupportMultipleFiles={isSupportMultipleFiles}
          headerName={headerName}
          value={valueRef.current.text}
          autoSave={autoSave}
          saveDelay={saveDelay}
          isCheckBrowser={isCheckBrowser}
          editorApi={editorApi}
          onSaveEditorValue={saveValue}
          onEditorValueChanged={saveValue}
          onCloseEditorDialog={onCloseEditorDialog}
        />
      )}
    </>
  );

};

NormalEditor.propTypes = {
  isFocus: PropTypes.bool,
  autoSave: PropTypes.bool,
  isCheckBrowser: PropTypes.bool,
  saveDelay: PropTypes.number,
  lang: PropTypes.string,
  headerName: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  editorApi: PropTypes.object,
  onSaveEditorValue: PropTypes.func,
  onEditorValueChanged: PropTypes.func,
};

export default NormalEditor;
