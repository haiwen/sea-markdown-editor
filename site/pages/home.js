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
        <NavLink to={'/wiki-view'}>Wiki Viewer</NavLink>
        <NavLink to={'/plain-markdown-viewer'}>Plain markdown Viewer</NavLink>
      </div>
      <div className='tip-message'>请点击其他链接，测试不同的页面内容</div>
    </div>
  );
}
