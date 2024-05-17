import React, { useCallback, useEffect, useState } from 'react';
import { LongTextInlineEditor } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/longtext-page.css';

const LongTextInlinePage = () => {

  const [value, setFileValue] = useState('');
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileValue(res.data);
      setIsFetching(false);
    });
  }, []);

  const onSaveEditorValue = useCallback((value) => {
    const { text } = value;
    setFileValue(text);
  }, []);

  if (isFetching) {
    return '';
  }

  return (
    <div className='long-text-page'>
      <div className='editor-wrapper'>
        <div className='preview-container' style={{ padding: '30px 8px', width: 600 }}>
          <LongTextInlineEditor
            lang={'zh-cn'}
            autoSave={true}
            saveDelay={6000}
            isCheckBrowser={true}
            headerName={'Edit cell value'}
            value={value}
            editorApi={editorApi}
            onSaveEditorValue={onSaveEditorValue}
          />
        </div>
      </div>
    </div>
  );
};

export default LongTextInlinePage;
