import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Editable, Slate } from 'slate-react';
import { Editor, Node } from 'slate';
import { baseEditor, Toolbar, renderElement, renderLeaf, useHighlight, SetNodeToDecorations } from '../../extension';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import withPropsEditor from './with-props-editor';
import { focusEditor } from '../../extension/core';
import { isMac } from '../../utils/common';

import './style.css';

const isMacOS = isMac();

export default function SimpleSlateEditor({ value, editorApi, onSave, columns, onContentChanged, isSupportFormula }) {
  const [slateValue, setSlateValue] = useState(value);

  const editor = useMemo(() => withPropsEditor(baseEditor, { editorApi, onSave, columns }), [columns, editorApi, onSave]);
  const eventProxy = useMemo(() => {
    return new EventProxy(editor);
  }, [editor]);
  const decorate = useHighlight(editor);

  const onChange = useCallback((value) => {
    setSlateValue(value);
    if (editor.forceNormalize) return;
    const operations = editor.operations;
    const modifyOps = operations.filter(o => o.type !== 'set_selection');
    if (modifyOps.length > 0) {
      onContentChanged && onContentChanged(value);
    }
    const eventBus = EventBus.getInstance();
    eventBus.dispatch('change');
  }, [editor, onContentChanged]);

  const focusFirstNode = useCallback((editor) => {
    const [firstNode] = editor.children;
    const [firstNodeFirstChild] = firstNode.children;
    if (firstNodeFirstChild) {
      const endOfFirstNode = Editor.end(editor, [0, 0]);
      const range = {
        anchor: endOfFirstNode,
        focus: endOfFirstNode,
      };
      focusEditor(editor, range);
    }
  }, []);

  // useMount: focus editor
  useEffect(() => {
    editor.forceNormalize = true;
    Editor.normalize(editor, { force: true });
    const timer = setTimeout(() => {
      editor.forceNormalize = false;
      focusFirstNode(editor);
    }, 300);
    return () => {
      editor.forceNormalize = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // willUnmount
  useEffect(() => {
    return () => {
      editor.selection = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEditorClick = useCallback(() => {
    const value = editor.children;
    if (value.length === 1 && Node.string(value[0]).length === 0) {
      focusFirstNode(editor);
    }
  }, [editor, focusFirstNode]);

  return (
    <div className='sf-simple-slate-editor-container'>
      <Toolbar editor={editor} isSupportFormula={isSupportFormula} isSupportColumn={!!columns} />
      <div className='sf-slate-editor-content' onClick={onEditorClick}>
        <Slate editor={editor} initialValue={slateValue} onChange={onChange}>
          <div className={`sf-slate-scroll-container ${isMacOS ? '' : 'isWin'}`}>
            <div className='sf-slate-article-container'>
              <div className='article'>
                <SetNodeToDecorations />
                <Editable
                  decorate={decorate}
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
