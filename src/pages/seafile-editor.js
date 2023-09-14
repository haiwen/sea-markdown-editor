import React, { useCallback, useState } from 'react';
import { Editable, Slate } from 'slate-react';
import defaultEditor, { Toolbar, renderElement, renderLeaf } from '../extension';

import '../assets/css/seafile-editor.css';

export default function SeafileEditor({isReadonly, value}) {

  const [slateValue, setSlateValue] = useState(value);
  const onChange = useCallback((value) => {
    setSlateValue(value);
  }, []);

  return (
    <div className='seafile-editor-container'>
      {!isReadonly && <Toolbar editor={defaultEditor} readonly={isReadonly} />}
      <div className='seafile-editor-content'>
        <Slate editor={defaultEditor} initialValue={slateValue} onChange={onChange}>
          <div className='seafile-article-container'>
            <div className='article'>
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </div>
          </div>
        </Slate>
      </div>
    </div>
  );
}
