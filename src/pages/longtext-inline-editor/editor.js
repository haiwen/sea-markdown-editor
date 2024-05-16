import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import SimpleEditor from '../simple-editor';
import getPreviewContent from '../../utils/get-preview-content';
import MarkdownPreview from '../markdown-preview';
import LongTextEditorDialog from '../longtext-editor-dialog';

import './index.css';

const Editor = ({
  lang,
  headerName,
  value: propsValue,
  isWindowsWechat,
  focusNodePath,
  autoSave = true,
  saveDelay = 60000,
  isCheckBrowser = false,
  editorApi,
  onSaveEditorValue,
  onEditorValueChanged,
}) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [style, setStyle] = useState({});
  const [isValueChanged, setValueChanged] = useState(false);
  const [showExpandEditor, setShowExpandEditor] = useState(false);
  const [value, setValue] = useState(typeof propsValue === 'string' ? { text: propsValue } : propsValue);

  const saveValue = useCallback((value, save = false) => {
    setValueChanged(true);
    setValue(value);
    onEditorValueChanged && onEditorValueChanged(value);
    if (!save) return;
    onSaveEditorValue && onSaveEditorValue(value);
    setValueChanged(false);
  }, [onSaveEditorValue, onEditorValueChanged]);

  const handelAutoSave = useCallback(() => {
    if (!isValueChanged) return;
    saveValue(value, true);
  }, [isValueChanged, value, saveValue]);

  const onContentChanged = useCallback(() => {
    // delay to update editor's content
    setTimeout(() => {
      // update parent's component cache value
      const markdownString = editorRef.current?.getValue();
      const slateNodes = editorRef.current?.getSlateValue();
      const { previewText, images, links, checklist } = getPreviewContent(slateNodes, false);
      const value = { text: markdownString, preview: previewText, images: images, links: links, checklist };
      saveValue(value);
    }, 0);
  }, [saveValue]);

  const openEditorDialog = useCallback(() => {
    const { height } = editorContainerRef.current.getBoundingClientRect();
    setStyle({ height });
    setShowExpandEditor(true);
  }, [editorContainerRef]);

  const onCloseEditorDialog = useCallback((value) => {
    value && saveValue(value);
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

  return (
    <>
      <div className="sf-long-text-inline-editor-container" style={style} ref={editorContainerRef}>
        {(!showExpandEditor && !isWindowsWechat) ? (
          <SimpleEditor
            isInline={true}
            focusNodePath={focusNodePath}
            ref={editorRef}
            value={value.text}
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
                isWindowsWechat={isWindowsWechat}
                value={value.text}
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
          headerName={headerName}
          value={value.text}
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

Editor.propTypes = {
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

export default Editor;
