import React, { useCallback, useState } from 'react';
import { MarkdownViewer } from '@seafile/seafile-editor';
import LongTextEditor from '../components/long-text-editor';

export default function LongTextDemo() {

  const [value, setValue] = useState('');
  const [isShowEditor, setIsShowEditor] = useState(false);

  const onEditClick = useCallback(() => {
    setIsShowEditor(!isShowEditor);
  }, [isShowEditor]);

  return (
    <div className='long-text-editor-wrapper'>
      <div className='preview-container'>
        <MarkdownViewer value={value} isShowOutline={false} />
      </div>
      <div className='editor-container'>
        <button onClick={onEditClick}>Edit Cell value</button>
      </div>
      {isShowEditor && (
        <LongTextEditor
          headerName={'Edit cell value'}
          value={value}
          updateValue={setValue}
          onCloseEditor={onEditClick}
        />
      )}
    </div>
  );
}
