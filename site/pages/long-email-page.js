import React, { useCallback, useEffect, useState } from 'react';
import { SeaTableViewer, EmailEditorDialog, mdStringToSlate } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/longtext-page.css';

const columns = [
  { type: 'text', key: '111', name: 'aaaddafdfaffaffdfa dfasdfafas' },
  { type: 'text', key: '222', name: 'bbb' },
  { type: 'text', key: '333', name: 'ccc' },
  { type: 'text', key: '444', name: 'ddd' },
  { type: 'text', key: '555', name: 'eee' },
  { type: 'text', key: '666', name: 'fff' },
  { type: 'text', key: '777', name: 'ggg' },
  { type: 'text', key: '888', name: 'hhh' },
];

export default function LongEmailPage() {

  const [value, setFileValue] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isShowEditor, setIsShowEditor] = useState(false);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      const value = JSON.stringify(mdStringToSlate(res.data));
      setFileValue(value);
      setIsFetching(false);
    });
  }, []);

  const onSaveEditorValue = useCallback((value) => {
    setFileValue(JSON.stringify(value));
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
          <SeaTableViewer value={value} isShowOutline={false} />
        </div>
        <button onClick={onEditClick}>Edit Cell value</button>
      </div>
      {isShowEditor && (
        <EmailEditorDialog
          lang={'zh-cn'}
          isCheckBrowser={true}
          headerName={'Edit cell value'}
          value={value}
          columns={columns}
          editorApi={editorApi}
          onSaveEditorValue={onSaveEditorValue}
          onCloseEditorDialog={onEditClick}
        />
      )}
    </div>
  );
}
