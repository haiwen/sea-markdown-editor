import React, { useCallback, useState, useMemo } from 'react';
import { Editable, Slate } from 'slate-react';
import { baseEditor, Toolbar, renderElement, renderLeaf } from '../../extension';
import Outline from '../../containers/outline';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import withPropsEditor from './with-props-editor';
import SeafileHelp from './markdown-help';

import '../../assets/css/markdown-editor.css';

export default function MarkdownEditor({ isReadonly, value, editorApi, onSave }) {
  const [slateValue, setSlateValue] = useState(value);

  const editor = useMemo(() => withPropsEditor(baseEditor, { editorApi, onSave }), [editorApi, onSave]);
  const eventProxy = useMemo(() => {
    return new EventProxy(editor);
  }, [editor]);

  const onChange = useCallback((value) => {
    setSlateValue(value);
    const eventBus = EventBus.getInstance();
    eventBus.dispatch('change');
  }, []);

  console.log(editor.children);

  return (
    <div className='sf-markdown-editor-container'>
      {!isReadonly && <Toolbar editor={editor} readonly={isReadonly} />}
      <div className='sf-markdown-editor-content'>
        <Slate editor={editor} initialValue={slateValue} onChange={onChange}>
          <div className='sf-markdown-scroll-container'>
            <div className='sf-markdown-article-container'>
              <div className='article'>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={eventProxy.onKeyDown}
                  onCopy={eventProxy.onCopy}
                />
              </div>
            </div>
          </div>
          <SeafileHelp>
            <Outline editor={editor} />
          </SeafileHelp>
        </Slate>
      </div>
    </div >
  );
}
