import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SeafileEditor from './pages/seafile-editor';
import SeafileViewer from './pages/seafile-viewer';
import Home from './pages/home';
import SimpleMarkdownEditor from './pages/simple-editor';
import SeaTableMarkdownEditor from './pages/seatable-editor';
import SeaTableMarkdownViewer from './pages/seatable-viewer';
import LongTextPage from './pages/long-text-page';
import LongEmailPage from './pages/long-email-page';
import InlineLongTextPage from './pages/inline-long-text-page';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/seafile-editor" element={<SeafileEditor />}></Route>
      <Route path="/seafile-viewer" element={<SeafileViewer />}></Route>
      <Route path="/simple-markdown-editor" element={<SimpleMarkdownEditor />}></Route>
      <Route path="/seatable-markdown-editor" element={<SeaTableMarkdownEditor />}></Route>
      <Route path="/seatable-markdown-viewer" element={<SeaTableMarkdownViewer />}></Route>
      <Route path="/long-text-editor" element={<LongTextPage />}></Route>
      <Route path="/inline-long-text-editor" element={<InlineLongTextPage />}></Route>
      <Route path="/long-email-editor" element={<LongEmailPage />}></Route>
    </Routes>
  );
}
