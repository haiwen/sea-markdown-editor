import React, { useCallback, useEffect, useState } from 'react';
import { MarkdownEditor, EventBus, EXTERNAL_EVENTS } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/seafile-editor.css';

export default function SeafileEditor() {

  const [fileContent, setFileContent] = useState({});
  const [isFetching, setIsFetching] = useState(true);

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

  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
        <span className='helper' onClick={onHelperClick}>显示帮助</span>
      </div>
      <MarkdownEditor
        isFetching={isFetching}
        value={fileContent}
        editorApi={editorApi}
      />
    </div>
  );
}
