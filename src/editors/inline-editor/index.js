import React, { useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editable, Slate } from 'slate-react';
import { Editor, Node } from 'slate';
import { inlineEditor, InlineToolbar, renderElement, renderLeaf, useHighlight, SetNodeToDecorations } from '../../extension';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import withPropsEditor from './with-props-editor';
import { focusEditor } from '../../extension/core';
import { isMac } from '../../utils/common';

import './index.css';

const isMacOS = isMac();

const InlineEditor = ({ isShowEditor, focusRange, value, editorApi, onSave, columns, onContentChanged, isSupportFormula, onExpandEditorToggle, updateFocus }) => {
  const [slateValue, setSlateValue] = useState(value);

  const editor = useMemo(() => {
    const baseEditor = inlineEditor();
    return withPropsEditor(baseEditor, { editorApi, onSave, columns });
  }, [columns, editorApi, onSave]);
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


  const focusNode = useCallback((editor, focusRange) => {
    const [firstNode] = editor.children;
    if (!firstNode) return;

    if (focusRange && typeof focusRange === 'object' && focusRange.anchor) {
      const startOfFirstNode = Editor.start(editor, focusRange.anchor.path);
      const range = {
        anchor: startOfFirstNode,
        focus: startOfFirstNode,
      };
      focusEditor(editor, range);
      setTimeout(() => focusEditor(editor, focusRange), 0);
      return;
    }

    const [firstNodeFirstChild] = firstNode.children;
    if (firstNodeFirstChild) {
      const startOfFirstNode = Editor.start(editor, [0, 0]);
      const range = {
        anchor: startOfFirstNode,
        focus: startOfFirstNode,
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
    }, 300);
    return () => {
      editor.forceNormalize = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isShowEditor) return;
    focusNode(editor, focusRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowEditor, focusRange]);

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

  const onEditorClick = useCallback(() => {
    if (!isShowEditor) {
      updateFocus(editor.selection);
      return;
    }
    const value = editor.children;
    if (value.length === 1 && Node.string(value[0]).length === 0) {
      focusNode(editor);
    }
  }, [isShowEditor, editor, focusNode, updateFocus]);

  return (
    <div className="sf-simple-slate-editor-container">
      {isShowEditor && (<InlineToolbar editor={editor} isSupportFormula={isSupportFormula} isSupportColumn={!!columns} onExpandEditorToggle={onExpandEditorToggle} />)}
      <div className="sf-slate-editor-content" onClick={onEditorClick}>
        <Slate editor={editor} initialValue={slateValue} onChange={onChange}>
          <div className={`sf-slate-scroll-container ${isMacOS ? '' : 'isWin'}`}>
            <div className="sf-slate-article-container">
              <div className="article">
                <SetNodeToDecorations />
                <Editable
                  readOnly={!isShowEditor}
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

InlineEditor.propTypes = {
  isSupportFormula: PropTypes.bool,
  value: PropTypes.array,
  editorApi: PropTypes.object,
  onSave: PropTypes.func,
  columns: PropTypes.array,
  onContentChanged: PropTypes.func,
  onExpandEditorToggle: PropTypes.func,
};

export default InlineEditor;
