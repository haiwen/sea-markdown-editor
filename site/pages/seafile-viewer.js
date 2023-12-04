import React, { useCallback, useEffect, useState } from 'react';
import { MarkdownViewer } from '@seafile/seafile-editor';
import { Button } from 'reactstrap';
import editorApi from '../api';
import { serverConfig } from '../setting';

import '../assets/css/seafile-editor.css';

export default function SeafileViewer() {

  const [fileContent, setFileContent] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [isShowOutline, setIsShowOutLine] = useState(true);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileContent(res.data);
      setIsFetching(false);
      console.log(res.data);
    });
  });

  const onOutlineToggle = useCallback(() => {
    setIsShowOutLine(!isShowOutline);
  }, [isShowOutline]);

  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
        <Button className='helper' onClick={onOutlineToggle}>{isShowOutline ? 'Close outline' : 'Show outline'}</Button>
      </div>
      <div className='markdown-viewer-container'>
        <MarkdownViewer
          isFetching={isFetching}
          value={fileContent}
          editorApi={editorApi}
          isShowOutline={isShowOutline}
          mathJaxSource={serverConfig.mathJaxSource}
        />
      </div>
    </div>
  );
}
