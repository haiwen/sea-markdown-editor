import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Editable, Slate } from 'slate-react';
import { Editor } from 'slate';
import PropTypes from 'prop-types';
import { baseEditor, Toolbar, renderElement, renderLeaf, useHighlight, SetNodeToDecorations } from '../../extension';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import withPropsEditor from './with-props-editor';
import { focusEditor } from '../../extension/core';
import { isDocumentEmpty, isMac } from '../../utils/common';

import './style.css';

const isMacOS = isMac();

const SimpleSlateEditor = ({ value, focusEnd, editorApi, onSave, columns, onContentChanged, isSupportFormula, onExpandEditorToggle }) => {
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

  const focusNode = useCallback((editor) => {
    const [firstNode] = editor.children;
    if (!firstNode) return;

    const [firstNodeFirstChild] = firstNode.children;
    if (firstNodeFirstChild) {
      const startOfFirstNode = Editor.start(editor, [0, 0]);
      let range = {
        anchor: startOfFirstNode,
        focus: startOfFirstNode,
      };
      if (focusEnd) {
        const lastIndex = editor.children.length - 1;
        const [, path] = Editor.last(editor, [lastIndex]);
        const endOfLastNodePoint = Editor.end(editor, path);
        range = {
          anchor: endOfLastNodePoint,
          focus: endOfLastNodePoint,
        };
      }

      focusEditor(editor, range);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWheel = useCallback((event) => {
    event.stopPropagation();
  }, []);

  // const focusEndNode = useCallback((editor) => {
  //   const lastChildIndex = editor.children.length - 1;
  //   if (lastChildIndex < 0) return;
  //   const lastNode = editor.children[lastChildIndex];
  //   if (!lastNode) return;
  //   const [lastNodeFirstChild] = lastNode.children;
  //   if (lastNodeFirstChild) {
  //     const endOfFirstNode = Editor.end(editor, [lastChildIndex, 0]);
  //     const range = {
  //       anchor: endOfFirstNode,
  //       focus: endOfFirstNode,
  //     };
  //     focusEditor(editor, range);
  //   }
  // }, []);

  // useMount: focus editor
  useEffect(() => {
    editor.forceNormalize = true;
    Editor.normalize(editor, { force: true });
    const timer = setTimeout(() => {
      editor.forceNormalize = false;
      focusNode(editor);
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
      editor.history = {
        redos: [],
        undos: [],
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus at start of document, when document is empty
  const onEditorClick = useCallback(() => {
    const isDocEmpty = isDocumentEmpty(editor);
    if (isDocEmpty) {
      focusNode(editor);
    }
  }, [editor, focusNode]);

  return (
    <div className='sf-simple-slate-editor-container'>
      <Toolbar editor={editor} isSupportFormula={isSupportFormula} isSupportColumn={!!columns} />
      <div className='sf-slate-editor-content' onClick={onEditorClick}>
        <Slate editor={editor} initialValue={slateValue} onChange={onChange}>
          <div className={`sf-slate-scroll-container ${isMacOS ? '' : 'isWin'}`}>
            <div className='sf-slate-article-container' onWheel={handleWheel}>
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
};

SimpleSlateEditor.propTypes = {
  isSupportFormula: PropTypes.bool,
  value: PropTypes.array,
  editorApi: PropTypes.object,
  onSave: PropTypes.func,
  columns: PropTypes.array,
  onContentChanged: PropTypes.func,
  onExpandEditorToggle: PropTypes.func,
};

export default SimpleSlateEditor;
