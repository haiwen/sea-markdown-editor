import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { Editable, Slate } from 'slate-react';
import { Editor } from 'slate';
import { baseEditor, Toolbar, renderElement, renderLeaf, useHighlight, SetNodeToDecorations } from '../../extension';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import withPropsEditor from './with-props-editor';
import EditorHelp from './editor-help';
import { focusEditor } from '../../extension/core';
import { ScrollContext } from '../../hooks/use-scroll-context';
import useSeafileUtils from '../../hooks/use-insert-image';
import { isMac } from '../../utils/common';

import './style.css';

const isMacOS = isMac();
export default function SlateEditor({ value, editorApi, onSave, onContentChanged, isSupportFormula, isSupportInsertSeafileImage, children }) {
  const [slateValue, setSlateValue] = useState(value);

  const scrollRef = useRef(null);
  const editor = useMemo(() => withPropsEditor(baseEditor, { editorApi, onSave }), [editorApi, onSave]);
  const eventProxy = useMemo(() => {
    return new EventProxy(editor);
  }, [editor]);

  useSeafileUtils(editor);

  const decorate = useHighlight(editor);

  const onChange = useCallback((value) => {
    setSlateValue(value);
    const operations = editor.operations;
    const modifyOps = operations.filter(o => o.type !== 'set_selection');
    if (modifyOps.length > 0) {
      onContentChanged && onContentChanged(value);
    }

    const eventBus = EventBus.getInstance();
    eventBus.dispatch('change');
  }, [editor.operations, onContentChanged]);

  // useMount: focus editor
  useEffect(() => {
    Editor.normalize(editor, { force: true });
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

  // willUnmount
  useEffect(() => {
    return () => {
      editor.selection = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='sf-slate-editor-container'>
      <Toolbar editor={editor} isRichEditor={true} isSupportFormula={isSupportFormula} isSupportInsertSeafileImage={isSupportInsertSeafileImage} />
      <div className='sf-slate-editor-content'>
        <ScrollContext.Provider value={{ scrollRef }}>
          <Slate editor={editor} initialValue={slateValue} onChange={onChange}>
            <div ref={scrollRef} className={`sf-slate-scroll-container ${isMacOS ? '' : 'isWin'}`}>
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
            <EditorHelp children={children}></EditorHelp>
          </Slate>
        </ScrollContext.Provider>
      </div>
    </div >
  );
}
