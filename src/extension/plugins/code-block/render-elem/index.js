import React from 'react';
import LanguageSelector from './languageSelector';

const renderCodeBlock = ({ attributes, children }) => {
  return (
    <div className='sf-code-block-container'>
      <pre {...attributes}>
        <code>{children}</code>
      </pre>
      <LanguageSelector />
    </div>
  );
};

export default renderCodeBlock;
