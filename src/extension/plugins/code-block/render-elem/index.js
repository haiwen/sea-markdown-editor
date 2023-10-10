/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSlate } from 'slate-react';
import LanguageSelector from './languageSelector';
import { isInCodeBlock } from '../helpers';

const renderCodeBlock = ({ attributes, children, element }) => {
  const editor = useSlate();
  const [isShowLanguageSelector, setIsShowLanguageSelector] = useState(true);
  const codeBlockRef = useRef(null);

  useEffect(() => {
    if (isShowLanguageSelector && !isInCodeBlock(editor)) onHideLanguageSelector();
    if (!isShowLanguageSelector && isInCodeBlock(editor)) registerEventHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.selection]);

  const onHideLanguageSelector = useCallback((e) => {
    if (codeBlockRef?.current?.contains(e?.target)) return;
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

  return (
    <div
      ref={codeBlockRef}
      className='sf-code-block-container'
    >
      <pre {...attributes}>
        <code>{children}</code>
      </pre>
      {isShowLanguageSelector && <LanguageSelector lang={element.lang} />}
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
