import React, { useCallback, useState } from 'react';
import { Editable, Slate } from 'slate-react';
import defaultEditor, { Toolbar, renderElement, renderLeaf } from '../../extension';
import SeafileHelp from './markdown-help';

import '../../assets/css/markdown-editor.css';

export default function MarkdownEditor({isReadonly, value, children}) {

  const [slateValue, setSlateValue] = useState(value);
  const onChange = useCallback((value) => {
    setSlateValue(value);
  }, []);

  return (
    <div className='sf-markdown-editor-container'>
      {!isReadonly && <Toolbar editor={defaultEditor} readonly={isReadonly} />}
      <div className='sf-markdown-editor-content'>
        <Slate editor={defaultEditor} initialValue={slateValue} onChange={onChange}>
          <div className='sf-markdown-scroll-container'>
            <div className='sf-markdown-article-container'>
              <div className='article'>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                />
              </div>
            </div>
          </div>
          <SeafileHelp />
        </Slate>
      </div>
    </div>
  );
}
