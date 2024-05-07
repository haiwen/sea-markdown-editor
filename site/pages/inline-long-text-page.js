import React, { useCallback, useEffect, useState } from 'react';
import { MarkdownViewer, InlineLongTextEditor } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/longtext-page.css';

const InlineLongTextPage = () => {

  const [value, setFileValue] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isShowEditor, setIsShowEditor] = useState(false);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileValue(res.data);
      setIsFetching(false);
    });
  }, []);

  const onEditClick = useCallback(() => {
    setIsShowEditor(!isShowEditor);
  }, [isShowEditor]);

  const onSaveEditorValue = useCallback((value) => {
    console.log('save value');
    const { text } = value;
    setFileValue(text);
  }, []);

  if (isFetching) {
    return '';
  }

  return (
    <div className='long-text-page'>
      <div className='editor-wrapper'>
        <button onClick={onEditClick}>Edit Cell value</button>
        <div className='preview-container' style={{ padding: '30px 8px' }}>
          {isShowEditor ? (
            <InlineLongTextEditor
              lang={'zh-cn'}
              autoSave={true}
              saveDelay={6000}
              isCheckBrowser={true}
              headerName={'Edit cell value'}
              value={value}
              editorApi={editorApi}
              onSaveEditorValue={onSaveEditorValue}
            />
          ) : (
            <MarkdownViewer value={value} isShowOutline={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InlineLongTextPage;
