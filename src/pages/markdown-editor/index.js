import React, { useCallback, useState, useMemo } from 'react';
import { Editable, Slate, ReactEditor } from 'slate-react';
import { baseEditor, Toolbar, renderElement, renderLeaf } from '../../extension';
import { getAboveBlockNode, getNextNode, getPrevNode, isSelectionAtBlockEnd, isSelectionAtBlockStart } from '../../extension/core';
import SeafileHelp from './markdown-help';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import { getCursorPosition, getDomHeight } from '../../utils/dom-utils';
import '../../assets/css/markdown-editor.css';


export default function MarkdownEditor({ isReadonly, value, children, editor = baseEditor }) {
  const [slateValue, setSlateValue] = useState(value);

  const eventProxy = useMemo(() => new EventProxy(editor), [editor]);
  const onChange = useCallback((value) => {
    setSlateValue(value);
    const evnetBus = EventBus.getInstance();
    evnetBus.dispatch('change');
  }, []);
  const onKeyDown = useCallback((event) => {

    eventProxy.onKeyDown(event);

    if (event.key === 'ArrowLeft') {
      if (!isSelectionAtBlockStart(editor)) return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      let prevNode = getPrevNode(editor);

      if (!prevNode) return;
      const domNode = ReactEditor.toDOMNode(editor, prevNode[0]);
      const domHeight = getDomHeight(domNode);

      const isScrollUp = true;
      const { y } = getCursorPosition(isScrollUp);
      if (y >= domHeight) return;
      return;
    }

    if (event.key === 'ArrowRight') {
      if (!isSelectionAtBlockEnd(editor)) return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      let nextNode = getNextNode(editor);
      if (!nextNode) return;
      return;
    }

    if (event.key === 'Backspace') {
      const { y } = getCursorPosition();

      // above viewport
      if (y < 0) {
        if (isSelectionAtBlockStart(editor)) {
          const prevNode = getPrevNode(editor);
          if (!prevNode) return;
          const node = getAboveBlockNode(editor);
          if (!node) return;
        }
        return;
      }

    }
  }
  , [editor, eventProxy]);
  return (
    <div className='sf-markdown-editor-container'>
      {!isReadonly && <Toolbar editor={baseEditor} readonly={isReadonly} />}
      <div className='sf-markdown-editor-content'>
        <Slate editor={baseEditor} initialValue={slateValue} onChange={onChange}>
          <div className='sf-markdown-scroll-container'>
            <div className='sf-markdown-article-container'>
              <div className='article'>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>
          </div>
          <SeafileHelp />
        </Slate>
      </div>
    </div >
  );
}
