import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SeaTableEditor, mdStringToSlate } from '@seafile/seafile-editor';
import { Button } from 'reactstrap';
import editorApi from '../api';
import toaster from '../commons/toast';

import '../assets/css/seafile-editor.css';

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

export default function SeaTableMarkdownEditor() {

  const editorRef = useRef(null);
  const [fileContent, setFileContent] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      console.log(res.data);
      const value = mdStringToSlate(res.data);
      setFileContent(value);
      setIsFetching(false);
    });
  }, []);

  const onSave = useCallback(() => {
    const content = editorRef.current.getSlateValue();
    if (content) {
      toaster.success('保存文件成功');
    } else {
      toaster.success('保存文件失败');
    }
    // editorApi.saveContent(content).then(res => {
    //   toaster.success('保存文件成功');
    // }).catch(() => {
    //   toaster.success('保存文件失败');
    // });
  }, []);

  const onContentChanged = useCallback(() => {
    setContentVersion(contentVersion + 1);
  }, [contentVersion]);

  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
        <div className='mr-4'>{`Content Version ${contentVersion}`}</div>
        <Button className='mr-2' onClick={onSave}>Save</Button>
      </div>
      <SeaTableEditor
        ref={editorRef}
        isFetching={isFetching}
        value={fileContent}
        editorApi={editorApi}
        columns={columns}
        onSave={onSave}
        onContentChanged={onContentChanged}
      />
    </div>
  );
}
