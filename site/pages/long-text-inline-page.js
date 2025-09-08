import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'reactstrap';
import { LongTextInlineEditor, EventBus, EXTERNAL_EVENTS } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/longtext-page.css';

const LongTextInlinePage = () => {

  const [value, setFileValue] = useState('');
  const [isFetching, setIsFetching] = useState(true);

  const editorRef = useRef(null);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileValue(res.data);
      setIsFetching(false);
    });
  }, []);

  const onSaveEditorValue = useCallback((value) => {
    const { text } = value;
    setFileValue(text);
  }, []);

  const clearContent = useCallback(() => {
    const editor = editorRef.current.getEditor();
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.CLEAR_ARTICLE, editor);
  }, [editorRef]);

  if (isFetching) {
    return '';
  }

  return (
    <div className='long-text-page'>
      <Button color="primary" className="position-absolute" style={{ right: 0 }} onClick={clearContent} >{'Clear content'}</Button>
      <div className='editor-wrapper'>
        <div className='preview-container' style={{ padding: '30px 8px', width: 600 }}>
          <LongTextInlineEditor
            ref={editorRef}
            isAlwaysEnableEdit={true}
            lang={'zh-cn'}
            autoSave={false}
            saveDelay={6000}
            isCheckBrowser={true}
            headerName={'Edit cell value'}
            value={value}
            isSupportFileToLink={true}
            isSupportMultipleFiles={true}
            editorApi={editorApi}
            onSaveEditorValue={onSaveEditorValue}
          />
        </div>
      </div>
    </div>
  );
};

export default LongTextInlinePage;
