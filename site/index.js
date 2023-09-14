import React from 'react';
import ReactDom from 'react-dom';
import { SeafileEditor } from '@seafile/seafile-editor';

import './assets/css/reset.css';

const value = [
  {type: 'blockquote', children: [{text: 'nihao'}]}
]

export default function App() {
  return (
    <SeafileEditor isReadonly={false} value={value} />
  );
}

ReactDom.render(<App />, document.getElementById('root'));
