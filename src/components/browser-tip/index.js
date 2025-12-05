import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

function BrowserTip({ lang, isWindowsWechat }) {

  if (lang !== 'zh-cn') return null;

  const msg = isWindowsWechat ? '你使用的微信存在兼容性问题，仅以只读模式预览。' : '你当前使用的浏览器可能存在兼容性问题。';
  return (
    <div className="sf-editor-browser-tip">
      <span className="browser-tip__icon mdfont md-description"></span>
      <span className="browser-tip__message">{`${msg}请试试以下浏览器: Chrome 浏览器最新版，360 极速版，Microsoft Edge 最新版`}</span>
    </div>
  );
}

BrowserTip.propTypes = {
  isWindowsWechat: PropTypes.bool,
  lang: PropTypes.string,
};

export default BrowserTip;
