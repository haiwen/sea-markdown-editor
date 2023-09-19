import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SeafileEditor from './pages/seafile-editor';
import SeafileViewer from './pages/seafile-viewer';
import WikiViewer from './pages/wiki-viewer';
import Home from './pages/home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/seafile-editor" element={<SeafileEditor />}></Route>
      <Route path="/seafile-viewer" element={<SeafileViewer />}></Route>
      <Route path="/wiki-viewer" element={<WikiViewer />}></Route>
    </Routes>
  );
}