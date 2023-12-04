import React from 'react';
import { baseEditor, renderElement, renderLeaf } from '../../extension';
import { Editable, Slate } from 'slate-react';
import Outline from '../../containers/outline';

import './style.css';

export default function SlateViewer({ value, isShowOutline  }) {

  return (
    <Slate editor={baseEditor} initialValue={value}>
      <div className={`sf-markdown-viewer-scroll-container ${isShowOutline ? 'outline' : ''}`}>
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
    </Slate>
  );
}
