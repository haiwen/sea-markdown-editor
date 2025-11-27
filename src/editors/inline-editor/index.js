import React, { useCallback, useState, useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Editable, Slate } from 'slate-react';
import { Editor, Range } from 'slate';
import slugid from 'slugid';
import { inlineEditor, InlineToolbar, renderElement, renderLeaf, useHighlight, SetNodeToDecorations } from '../../extension';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import withPropsEditor from './with-props-editor';
import { focusEditor } from '../../extension/core';
import { isDocumentEmpty, isMac } from '../../utils/common';
import { EXTERNAL_EVENTS } from '../../constants/event-types';
import { PARAGRAPH } from '../../extension/constants/element-types';
import useAttachments from '../../hooks/use-attachments';
import useLinkClick from '../../hooks/user-link-click';

import './index.css';

const isMacOS = isMac();

const InlineEditor = forwardRef(({
  enableEdit, autoFocus, value, editorApi, onSave, columns, onContentChanged,
  isSupportFormula, isImageUploadOnly, isSupportMultipleFiles,
  onExpandEditorToggle, handelEnableEdit
}, ref) => {
  const [slateValue, setSlateValue] = useState(value);
  const focusRangeRef = useRef(null);

  const editor = useMemo(() => {
    const baseEditor = inlineEditor();
    return withPropsEditor(baseEditor, { editorApi, onSave, columns, isSupportMultipleFiles, isImageUploadOnly });
  }, [columns, isImageUploadOnly, isSupportMultipleFiles, editorApi, onSave]);
  const eventProxy = useMemo(() => {
    return new EventProxy(editor);
  }, [editor]);

  useAttachments(editor);
  useLinkClick(editor._id);

  const decorate = useHighlight(editor);

  const onChange = useCallback((value) => {
    setSlateValue(value);

    if (!editor.hasMovedSelection && editor.selection && Range.isCollapsed(editor.selection)) {
      const isAtStart = Editor.isStart(editor, editor.selection.anchor, Editor.start(editor, []));
      if (!isAtStart) editor.hasMovedSelection = true;
    }

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

    if (focusRange && focusRange?.anchor) {
      const startOfFirstNode = Editor.start(editor, focusRange.anchor.path);
      const range = {
        anchor: startOfFirstNode,
        focus: startOfFirstNode,
      };
      focusEditor(editor, range);
      setTimeout(() => focusEditor(editor, focusRange), 0);
      focusRangeRef.current = null;
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
      if (!enableEdit) return;
      if (!autoFocus) return;
      focusNode(editor);
    }, 300);
    return () => {
      editor.forceNormalize = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!enableEdit) {
      editor.hasMovedSelection = false;
      return;
    }
    if (!autoFocus) return;
    focusNode(editor, focusRangeRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableEdit]);

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

  const handleClear = useCallback((targetEditor) => {
    if (targetEditor._id !== editor._id) return;
    editor.children = [{
      type: PARAGRAPH,
      id: slugid.nice(),
      children: [{ id: slugid.nice(), text: '' }],
    }];
    editor.selection = null;
    editor.operations = [
      { type: 'remove_text', path: [0, 0], offset: 0, text: '' }
    ];
    editor.onChange();
    editor.operations = [];
    editor.history = {
      redos: [],
      undos: [],
    };
  }, [editor]);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const clearSubscribe = eventBus.subscribe(EXTERNAL_EVENTS.CLEAR_ARTICLE, handleClear);
    return () => {
      clearSubscribe();
    };
  }, [handleClear]);

  useImperativeHandle(ref, () => {
    return {
      getEditor: () => editor,
    };
  }, [editor]);

  const onEditorClick = useCallback(() => {
    if (!enableEdit) {
      focusRangeRef.current = editor.selection;
      handelEnableEdit();
      return;
    }

    // Focus at start of document, when document is empty
    const isDoEmpty = isDocumentEmpty(editor);
    if (isDoEmpty) {
      focusNode(editor);
    }
  }, [enableEdit, editor, focusNode, handelEnableEdit]);

  return (
    <div className="sf-simple-slate-editor-container">
      {enableEdit && (<InlineToolbar editor={editor} isSupportFormula={isSupportFormula} isSupportColumn={!!columns} onExpandEditorToggle={onExpandEditorToggle} />)}
      <div className="sf-slate-editor-content" onClick={onEditorClick}>
        <Slate editor={editor} initialValue={slateValue} onChange={onChange}>
          <div className={`sf-slate-scroll-container ${isMacOS ? '' : 'isWin'}`}>
            <div className="sf-slate-article-container">
              <div className="article">
                <SetNodeToDecorations />
                <Editable
                  readOnly={!enableEdit}
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
});

InlineEditor.propTypes = {
  enableEdit: PropTypes.bool,
  isSupportFormula: PropTypes.bool,
  value: PropTypes.array,
  editorApi: PropTypes.object,
  onSave: PropTypes.func,
  columns: PropTypes.array,
  onContentChanged: PropTypes.func,
  onExpandEditorToggle: PropTypes.func,
  handelEnableEdit: PropTypes.func,
};

export default InlineEditor;
