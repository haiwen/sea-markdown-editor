import React from 'react';

const renderText = (props, editor) => {
  const { attributes, children, leaf } = props;
  const { text, ...rest } = leaf;

  let markedChildren = React.cloneElement(children);

  if (leaf.BOLD) {
    markedChildren = <strong>{markedChildren}</strong>;
  }

  if (leaf.ITALIC) {
    markedChildren = <i>{markedChildren}</i>;
  }

  if (leaf.UNDERLINE) {
    markedChildren = <span style={{textDecoration: 'underline'}}>{markedChildren}</span>;
  }

  if (leaf.STRIKETHROUGH) {
    markedChildren = <span style={{textDecoration: 'line-through'}}>{markedChildren}</span>;
  }

  if (leaf.SUPERSCRIPT) {
    markedChildren = <sup>{markedChildren}</sup>;
  }

  if (leaf.SUBSCRIPT) {
    markedChildren = <sub>{markedChildren}</sub>;
  }

  if (leaf.CODE) {
    markedChildren = <code>{markedChildren}</code>;
  }

  if (leaf.DELETE) {
    markedChildren = <del>{markedChildren}</del>;
  }

  if (leaf.ADD) {
    markedChildren = <span>{markedChildren}</span>;
  }

  if (leaf.decoration) {
    markedChildren = <span className={`token ${leaf.type}`}>{markedChildren}</span>;
  }

  return (
    <span data-id={leaf.id} {...attributes} className={Object.keys(rest).join(' ')}>
      {markedChildren}
    </span>
  );
};

export default renderText;
