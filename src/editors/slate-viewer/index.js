import React, { useRef } from 'react';
import { baseEditor, renderElement, renderLeaf } from '../../extension';
import { Editable, Slate } from 'slate-react';
import Outline from '../../containers/outline';
import { ScrollContext } from '../../hooks/use-scroll-context';

import './style.css';

export default function SlateViewer({ value, isShowOutline  }) {

  const scrollRef = useRef(null);

  return (
    <Slate editor={baseEditor} initialValue={value}>
      <ScrollContext.Provider value={{ scrollRef }}>
        <div ref={scrollRef} className={`sf-markdown-viewer-scroll-container ${isShowOutline ? 'outline' : ''}`}>
          <div className='sf-markdown-viewer-article-container'>
            <div className='article'>
              <Editable
                readOnly
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </div>
          </div>
          {isShowOutline && (
            <div className='sf-markdown-viewer-outline'>
              <Outline editor={baseEditor} />
            </div>
          )}
        </div>
      </ScrollContext.Provider>
    </Slate>
  );
}
