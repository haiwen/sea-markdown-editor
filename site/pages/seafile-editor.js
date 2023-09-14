import React from 'react'
import { MarkdownEditor } from '@seafile/seafile-editor';

import '../assets/css/seafile-editor.css';

const value = [
  {type: 'blockquote', children: [{text: 'nihao'}]}
]

export default function SeafileEditor() {
  return (
    <div className='seafile-editor'>
      <div className='seafile-editor-header'>
        <span className='helper'>显示帮助</span>
      </div>
      <MarkdownEditor isReadonly={false} value={value} />
    </div>
  );
}
