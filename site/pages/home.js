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
        <NavLink to={'/plain-markdown-editor'}>Plain markdown Editor</NavLink>
        <NavLink to={'/rich-markdown-editor'}>Rich markdown Editor</NavLink>
        <NavLink to={'/simple-markdown-editor'}>simple markdown Editor</NavLink>
      </div>
      <div className='tip-message'>请点击其他链接，测试不同的页面内容</div>
    </div>
  );
}
