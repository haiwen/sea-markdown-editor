import React from 'react';

export default function BrowserTip({ lang, isWindowsWechat }) {

  if (lang !== 'zh-cn') return null;

  const msg = isWindowsWechat ? '你使用的微信存在兼容性问题，仅以只读模式预览。' : '你当前使用的浏览器可能存在兼容性问题。';
  return (
    <div className="browser-tip">
      <span className="browser-tip__icon dtable-font dtable-icon-description"></span>
      <span className="browser-tip__message">{`${msg}请试试以下浏览器: Chrome 浏览器最新版，360 极速版，Microsoft Edge 最新版`}</span>
    </div>
  );
}
