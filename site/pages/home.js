import React from 'react';
import { NavLink } from 'react-router-dom';

import '../assets/css/app.css';

export default function Home() {
  return (
    <div className='app'>
      <div className='header'>seafile editor 测试页面</div>
      <div className='nav-container'>
        <NavLink to={''}></NavLink>
        <NavLink to={'/seafile-editor'}>Seafile Editor</NavLink>
        <NavLink to={'/seafile-viewer'}>Seafile Viewer</NavLink>
        <NavLink to={'/simple-markdown-editor'}>Simple markdown Editor</NavLink>
        <NavLink to={'/seatable-markdown-editor'}>SeaTable markdown Editor</NavLink>
        <NavLink to={'/seatable-markdown-viewer'}>SeaTable markdown Viewer</NavLink>
        <NavLink to={'/long-text-editor'}>Long Text Editor</NavLink>
        <NavLink to={'/long-text-inline-editor'}>Long Text Inline Editor</NavLink>
        <NavLink to={'/multiple-long-text-inline-editor'}>Multiple long Text Inline Editor</NavLink>
        <NavLink to={'/long-email-editor'}>Email Editor</NavLink>
      </div>
      <div className='tip-message'>请点击其他链接，测试不同的页面内容</div>
    </div>
  );
}
