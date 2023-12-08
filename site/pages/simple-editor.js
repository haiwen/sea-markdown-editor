import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SimpleEditor } from '@seafile/seafile-editor';
import { Button } from 'reactstrap';
import { serverConfig } from '../setting';
import editorApi from '../api';

import '../assets/css/seafile-editor.css';

export default function SimpleMarkdownEditor() {

  const editorRef = useRef(null);
  const [fileContent, setFileContent] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileContent(res.data);
      setIsFetching(false);
      console.log(res.data);
    });
  });

  const onSave = useCallback(() => {
    const content = editorRef.current.getValue();
    window.alert(content);
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
      <SimpleEditor
        ref={editorRef}
        isFetching={isFetching}
        value={fileContent}
        editorApi={editorApi}
        mathJaxSource={serverConfig.mathJaxSource}
        onSave={onSave}
        onContentChanged={onContentChanged}
      />
    </div>
  );
}
