import React, { useEffect, useMemo, useRef } from 'react';
import { SetNodeToDecorations, createSlateEditor, renderElement, renderLeaf, useHighlight } from '../../extension';
import { Editable, Slate } from 'slate-react';
import Outline from '../../containers/outline';
import { ScrollContext } from '../../hooks/use-scroll-context';
import useLinkClick from '../../hooks/user-link-click';
import { isMac } from '../../utils/common';

import './style.css';

const isMacOS = isMac();

export default function SlateViewer({ value, isShowOutline, scrollRef: externalScrollRef, onLinkClick }) {

  const scrollRef = useRef(null);
  const editor = useMemo(() => {
    return createSlateEditor();
  }, []);
  const containerScrollRef = externalScrollRef ? externalScrollRef : scrollRef;
  const decorate = useHighlight(editor);

  useLinkClick(onLinkClick);

  // willUnmount
  useEffect(() => {
    return () => {
      editor.selection = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Slate editor={editor} initialValue={value}>
      <ScrollContext.Provider value={{ scrollRef: containerScrollRef }}>
        <div ref={scrollRef} className={`sf-slate-viewer-scroll-container ${isMacOS ? '' : 'isWin'} ${isShowOutline ? 'outline' : ''}`}>
          <div className='sf-slate-viewer-article-container'>
            <div className='article'>
              <SetNodeToDecorations />
              <Editable
                readOnly={true}
                decorate={decorate}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </div>
          </div>
          {isShowOutline && (
            <div className='sf-slate-viewer-outline'>
              <Outline editor={editor} />
            </div>
          )}
        </div>
      </ScrollContext.Provider>
    </Slate>
  );
}
