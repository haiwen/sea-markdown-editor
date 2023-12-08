import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RichMarkdownEditor, EventBus, EXTERNAL_EVENTS } from '@seafile/seafile-editor';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import editorApi from '../api';
import { serverConfig } from '../setting';

import '../assets/css/seafile-editor.css';

export default function RichSeafileEditor() {

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
    }).catch((err) => {
      setIsFetching(false);
    });
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const insertImageToggle = () => {
      eventBus.dispatch(EXTERNAL_EVENTS.INSERT_IMAGE, { title: 'aa', url: 'http://127.0.0.1', isImage: false });
    };
    const subscribe = eventBus.subscribe(EXTERNAL_EVENTS.ON_INSERT_IMAGE, insertImageToggle);
    return subscribe;
  }, []);

  const onHelperClick = useCallback(() => {
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE, true);
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = useCallback(() => {
    setDropdownOpen(!dropdownOpen);
  }, [dropdownOpen]);

  const [mode, setMode] = useState('rich');
  const changeMode = useCallback(() => {
    const newMode = mode === 'rich' ? 'plain' : 'rich';
    setMode(newMode);
  }, [mode]);

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
        <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
          <DropdownToggle>
            <span className='helper iconfont icon-ellipsis-v'></span>
          </DropdownToggle>
          <DropdownMenu right={true}>
            <DropdownItem onClick={changeMode}>{`Switch to ${mode === 'rich' ? 'plain' : 'rich'} plain text editor`}</DropdownItem>
            <DropdownItem onClick={onHelperClick}>Help</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <RichMarkdownEditor
        ref={editorRef}
        mode={mode}
        isFetching={isFetching}
        // initValue={'第一章'}
        value={fileContent}
        editorApi={editorApi}
        mathJaxSource={serverConfig.mathJaxSource}
        onSave={onSave}
        onContentChanged={onContentChanged}
        isSupportInsertSeafileImage={true}
      >
        <div>aa</div>
      </RichMarkdownEditor>
    </div>
  );
}
