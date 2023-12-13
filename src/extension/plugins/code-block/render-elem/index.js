/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import LanguageSelector from './language-selector';
import { isInCodeBlock, setCodeBlockLanguage } from '../helpers';
import { EXPLAIN_TEXT } from './constant';
import { findPath } from '../../../core';

const renderCodeBlock = ({ attributes, children, element }, editor) => {
  const [isShowLanguageSelector, setIsShowLanguageSelector] = useState(true);
  const codeBlockRef = useRef(null);

  useEffect(() => {
    if (!editor.selection) return;
    if ( !isInCodeBlock(editor)) onHideLanguageSelector();
    if ( isInCodeBlock(editor)) registerEventHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, editor.selection]);

  const onHideLanguageSelector = useCallback((e) => {
    if (codeBlockRef?.current?.contains(e?.target) || isInCodeBlock(editor)) return;
    setIsShowLanguageSelector(false);
    unregisterEventHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsShowLanguageSelector]);
  const registerEventHandler = useCallback(() => {
    setIsShowLanguageSelector(true);
    document.addEventListener('click', onHideLanguageSelector, true);
  }, [onHideLanguageSelector]);

  const unregisterEventHandler = useCallback(() => {
    document.removeEventListener('click', onHideLanguageSelector);
  }, [onHideLanguageSelector]);

  const handleLangSelectorChange = (lang = EXPLAIN_TEXT) => {
    const path = findPath(editor, element);
    setCodeBlockLanguage(editor, lang, path);
  };

  return (
    <div
      ref={codeBlockRef}
      className='sf-code-block-container'
    >
      <pre {...attributes}>
        <code>{children}</code>
      </pre>
      {isShowLanguageSelector && <LanguageSelector lang={element.lang} handleLangSelectorChange={handleLangSelectorChange} />}
    </div>
  );
};

export default renderCodeBlock;

export const renderCodeLine = (props, editor) => {
  const { element, attributes, children } = props;
  return (
    <div data-id={element.id} {...attributes} className={'sf-code-line'}>
      {children}
    </div>
  );
};
