import React from 'react';
import LanguageSelector from './languageSelector';

const renderCodeBlock = ({ attributes, children, element }) => {
  return (
    <div className='sf-code-block-container'>
      <pre {...attributes}>
        <code>{children}</code>
      </pre>
      <LanguageSelector lang={element.lang} />
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
