import React, { useCallback, useState } from 'react';
import { MarkdownViewer, LongTextDialog } from '@seafile/seafile-editor';

import '../assets/css/longtext-page.css';

export default function LongTextPage() {

  const [value, setValue] = useState('');
  const [isShowEditor, setIsShowEditor] = useState(false);

  const onEditClick = useCallback(() => {
    setIsShowEditor(!isShowEditor);
  }, [isShowEditor]);

  return (
    <div className='long-text-page'>
      <div className='editor-wrapper'>
        <div className='preview-container'>
          <MarkdownViewer value={value} isShowOutline={false} />
        </div>
        <button onClick={onEditClick}>Edit Cell value</button>
      </div>
      {isShowEditor && (
        <LongTextDialog
          headerName={'Edit cell value'}
          value={value}
          updateValue={setValue}
          onCloseEditor={onEditClick}
        />
      )}
    </div>
  );
}
