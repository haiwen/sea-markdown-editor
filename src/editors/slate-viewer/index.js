import React, { useEffect, useRef } from 'react';
import { baseEditor, renderElement, renderLeaf } from '../../extension';
import { Editable, Slate } from 'slate-react';
import Outline from '../../containers/outline';
import { ScrollContext } from '../../hooks/use-scroll-context';

import './style.css';

export default function SlateViewer({ value, isShowOutline, scrollRef: externalScrollRef   }) {

  const scrollRef = useRef(null);
  const containerScrollRef = externalScrollRef ? externalScrollRef : scrollRef;

  // willUnmount
  useEffect(() => {
    return () => {
      baseEditor.selection = null;
    };
  });

  return (
    <Slate editor={baseEditor} initialValue={value}>
      <ScrollContext.Provider value={{ scrollRef: containerScrollRef }}>
        <div ref={scrollRef} className={`sf-slate-viewer-scroll-container ${isShowOutline ? 'outline' : ''}`}>
          <div className='sf-slate-viewer-article-container'>
            <div className='article'>
              <Editable
                readOnly={true}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </div>
          </div>
          {isShowOutline && (
            <div className='sf-slate-viewer-outline'>
              <Outline editor={baseEditor} />
            </div>
          )}
        </div>
      </ScrollContext.Provider>
    </Slate>
  );
}
