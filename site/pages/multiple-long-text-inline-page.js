import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'reactstrap';
import { LongTextInlineEditor, EventBus, EXTERNAL_EVENTS } from '@seafile/seafile-editor';
import editorApi from '../api';

import '../assets/css/longtext-page.css';

const MultipleLongTextInlinePage = () => {

  const [value, setFileValue] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [value2, setFileValue2] = useState('');

  const editorRef = useRef(null);
  const editor2Ref = useRef(null);

  useEffect(() => {
    editorApi.login().then(res => {
      return editorApi.getFileContent();
    }).then(res => {
      setFileValue(res.data);
      setFileValue2(res.data);
      setIsFetching(false);
    });
  }, []);

  const onSaveEditorValue = useCallback((value) => {
    const { text } = value;
    setFileValue(text);
  }, []);

  const onSaveEditorValue2 = useCallback((value) => {
    const { text } = value;
    setFileValue2(text);
  }, []);

  const clearContent = useCallback(() => {
    const editor = editorRef.current.getEditor();
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.CLEAR_ARTICLE, editor);
  }, [editorRef]);

  const clearContent2 = useCallback(() => {
    const editor = editor2Ref.current.getEditor();
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.CLEAR_ARTICLE, editor);
  }, [editor2Ref]);

  if (isFetching) {
    return '';
  }

  return (
    <div className="w-100 h-100 d-flex">
      <div className="w-50 d-flex p-4" style={{ flexDirection: 'column' }}>
        <Button color="primary" onClick={clearContent} className="mb-4" style={{ width: 'fit-content' }}>
          {'Clear content'}
        </Button>
        <LongTextInlineEditor
          ref={editorRef}
          isAlwaysEnableEdit={true}
          lang={'zh-cn'}
          autoSave={false}
          saveDelay={6000}
          isCheckBrowser={true}
          headerName={'Edit value'}
          value={value}
          isSupportFileToLink={true}
          isSupportMultipleFiles={true}
          editorApi={editorApi}
          onSaveEditorValue={onSaveEditorValue}
        />
      </div>
      <div className="w-50 d-flex p-4" style={{ flexDirection: 'column' }}>
        <Button color="primary" onClick={clearContent2} className="mb-4" style={{ width: 'fit-content' }}>
          {'Clear content'}
        </Button>
        <LongTextInlineEditor
          ref={editor2Ref}
          isAlwaysEnableEdit={true}
          lang={'zh-cn'}
          autoSave={false}
          saveDelay={6000}
          isCheckBrowser={true}
          headerName={'Edit value2'}
          value={value2}
          isSupportFileToLink={true}
          isSupportMultipleFiles={true}
          editorApi={editorApi}
          onSaveEditorValue={onSaveEditorValue2}
        />
      </div>
    </div>
  );
};

export default MultipleLongTextInlinePage;
