import React, { useEffect, useRef, useState } from 'react';
import { SeaTableViewer } from '@seafile/seafile-editor';
import editorApi from '../api';

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

export default function SeaTableMarkdownViewer() {

  const [fileContent, setFileContent] = useState('');
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

  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
        <div className='mr-4'>{'SeaTable viewer'}</div>
      </div>
      <SeaTableViewer
        isFetching={isFetching}
        value={fileContent}
        columns={columns}
      />
    </div>
  );
}
