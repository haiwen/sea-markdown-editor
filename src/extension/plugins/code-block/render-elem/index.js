import React from 'react';

const renderCodeBlock = ({ attributes, children }) => {
  return (
    <div>
      <pre {...attributes}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default renderCodeBlock;
