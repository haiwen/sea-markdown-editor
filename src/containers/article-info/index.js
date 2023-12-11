import React, { useCallback, useState } from 'react';
import Outline from '../outline';
import { useSlateStatic } from 'slate-react';

import './style.css';

const TAB_TYPES = {
  OUTLINE: 'outline',
  FILE_DETAIL: 'file_detail',
};

export default function ArticleInfo({ children }) {
  const editor = useSlateStatic();
  const [activeTab, setActiveTab] = useState(TAB_TYPES.OUTLINE);
  const onOutlineClick = useCallback(() => {
    if (activeTab === TAB_TYPES.OUTLINE) return;
    setActiveTab(TAB_TYPES.OUTLINE);
  }, [activeTab]);

  const onDetailClick = useCallback(() => {
    if (activeTab === TAB_TYPES.FILE_DETAIL) return;
    setActiveTab(TAB_TYPES.FILE_DETAIL);
  }, [activeTab]);

  return (
    <div className="sf-article-info-container">
      <ul className="sf-article-info-nav nav">
        <li className="nav-item">
          <span className={`nav-link ${activeTab === TAB_TYPES.OUTLINE && 'active'}`} onClick={onOutlineClick}><i className="iconfont icon-list-ul"/></span>
        </li>
        <li className="nav-item">
          <span className={`nav-link ${activeTab === TAB_TYPES.FILE_DETAIL && 'active'}`} onClick={onDetailClick}><i className={'iconfont icon-info-circle'}/></span>
        </li>
      </ul>
      <div className="sf-article-info-content">
        {activeTab === TAB_TYPES.OUTLINE && (
          <Outline editor={editor} />
        )}
        {activeTab === TAB_TYPES.FILE_DETAIL && (
          <>
            { children }
          </>
        )}
      </div>
    </div>
  );
}
