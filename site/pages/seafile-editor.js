import React, { useCallback, useEffect, useState } from 'react';
import { MarkdownEditor, EventBus, EXTERNAL_EVENTS } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/seafile-editor.css';

const value = [
  {type: 'blockquote', children: [{text: 'nihao'}]}
];

export default function SeafileEditor() {

  const [fileContent, setFileContent] = useState({});
  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileContent(res.data);
      console.log(res.data);
    });
  });

  const onHelperClick = useCallback(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE);
  }, []);

  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
        <span className='helper' onClick={onHelperClick}>显示帮助</span>
      </div>
      <MarkdownEditor isReadonly={false} value={value} editorApi={editorApi} />
    </div>
  );
}
