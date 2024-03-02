import React, { useCallback, useEffect, useState } from 'react';
import { MarkdownViewer, LongTextEditorDialog } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/longtext-page.css';

export default function LongTextPage() {

  const [value, setFileValue] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isShowEditor, setIsShowEditor] = useState(false);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileValue(res.data);
      setIsFetching(false);
      console.log(res.data);
    });
  }, []);

  const onEditClick = useCallback(() => {
    setIsShowEditor(!isShowEditor);
  }, [isShowEditor]);

  if (isFetching) {
    return '';
  }

  return (
    <div className='long-text-page'>
      <div className='editor-wrapper'>
        <div className='preview-container'>
          <MarkdownViewer value={value} isShowOutline={false} />
        </div>
        <button onClick={onEditClick}>Edit Cell value</button>
      </div>
      {isShowEditor && (
        <LongTextEditorDialog
          headerName={'Edit cell value'}
          value={value}
          updateValue={setFileValue}
          onCloseEditor={onEditClick}
        />
      )}
    </div>
  );
}
