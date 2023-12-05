import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SeafileEditor from './pages/seafile-editor';
import SeafileViewer from './pages/seafile-viewer';
import Home from './pages/home';
import PlainMarkdownViewer from './pages/plain-markdown-view';
import RichMarkdownViewer from './pages/rich-seafile-editor';
import SimpleMarkdownEditor from './pages/simple-editor';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/seafile-editor" element={<SeafileEditor />}></Route>
      <Route path="/seafile-viewer" element={<SeafileViewer />}></Route>
      <Route path="/plain-markdown-editor" element={<PlainMarkdownViewer />}></Route>
      <Route path="/rich-markdown-editor" element={<RichMarkdownViewer />}></Route>
      <Route path="/simple-markdown-editor" element={<SimpleMarkdownEditor />}></Route>
    </Routes>
  );
}
