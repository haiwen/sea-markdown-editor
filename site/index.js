import React from 'react';
import ReactDom from 'react-dom';
import Add from '@seafile/seafile-editor';

export default function App() {
  const count = Add(1, 4);
  return (
    <div>{count}</div>
  );
};

ReactDom.render(<App />, document.getElementById('root'));

