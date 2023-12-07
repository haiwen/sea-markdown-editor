import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Editable, Slate } from 'slate-react';
import { Editor } from 'slate';
import { createSlateEditor, Toolbar, renderElement, renderLeaf } from '../../extension';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import withPropsEditor from './with-props-editor';
import { focusEditor } from '../../extension/core';

import './style.css';

export default function SimpleSlateEditor({ value, editorApi, onSave, isSupportFormula }) {
  const [slateValue, setSlateValue] = useState(value);

  const editor = useMemo(() => withPropsEditor(createSlateEditor(), { editorApi, onSave }), [editorApi, onSave]);
  const eventProxy = useMemo(() => {
    return new EventProxy(editor);
  }, [editor]);

  const onChange = useCallback((value) => {
    setSlateValue(value);
    onSave && onSave(value);
    const eventBus = EventBus.getInstance();
    eventBus.dispatch('change');
  }, [onSave]);

  // useMount: focus editor
  useEffect(() => {
    const timer = setTimeout(() => {
      const [firstNode] = editor.children;
      if (firstNode) {
        const [firstNodeFirstChild] = firstNode.children;

        if (firstNodeFirstChild) {
          const endOfFirstNode = Editor.end(editor, [0, 0]);
          const range = {
            anchor: endOfFirstNode,
            focus: endOfFirstNode,
          };
          focusEditor(editor, range);
        }
      }
    }, 300);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='sf-simple-slate-editor-container'>
      <Toolbar editor={editor} isSupportFormula={isSupportFormula} />
      <div className='sf-slate-editor-content'>
        <Slate editor={editor} initialValue={slateValue} onChange={onChange}>
          <div className='sf-slate-scroll-container'>
            <div className='sf-slate-article-container'>
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
        </Slate>
      </div>
    </div >
  );
}
