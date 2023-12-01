import React, { useCallback, useEffect, useState } from 'react';
import { RichMarkdownEditor, EventBus, EXTERNAL_EVENTS } from '@seafile/seafile-editor';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import editorApi from '../api';

import '../assets/css/seafile-editor.css';

export default function RichSeafileEditor() {

  const [fileContent, setFileContent] = useState({});
  const [isFetching, setIsFetching] = useState(true);
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

  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
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
        mode={mode}
        isFetching={isFetching}
        value={fileContent}
        editorApi={editorApi}
      />
    </div>
  );
}
