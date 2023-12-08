import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MarkdownEditor, EventBus, EXTERNAL_EVENTS } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/seafile-editor.css';
import { Button } from 'reactstrap';

export default function SeafileEditor() {

  const editorRef = useRef(null);
  const [fileContent, setFileContent] = useState({});
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

  const onHelperClick = useCallback(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE, true);
  }, []);

  const onSave = useCallback(() => {
    const content = editorRef.current.getValue();
    window.alert(content);
  }, []);

  const onContentChange = useCallback(() => {
    setContentVersion(contentVersion + 1);
  }, [contentVersion]);

  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
        <div className='mr-4'>{`Content Version ${contentVersion}`}</div>
        <Button className='mr-2' onClick={onSave}>Save</Button>
        <span className='helper' onClick={onHelperClick}>显示帮助</span>
      </div>
      <MarkdownEditor
        ref={editorRef}
        isFetching={isFetching}
        value={fileContent}
        editorApi={editorApi}
        onSave={onSave}
        onContentChange={onContentChange}
      />
    </div>
  );
}
