import React from 'react';
import { ELementTypes } from '../../constants';

const renderText = (props, editor) => {
  const { attributes, children, leaf } = props;
  const { text, ...rest } = leaf;

  let markedChildren = React.cloneElement(children);

  const getLeafCase = (type) => {
    return Reflect.get(leaf, type);
  };

  if (getLeafCase(ELementTypes.BOLD)) {
    markedChildren = <strong>{markedChildren}</strong>;
  }

  if (getLeafCase(ELementTypes.ITALIC)) {
    markedChildren = <i>{markedChildren}</i>;
  }

  if (getLeafCase(ELementTypes.UNDERLINE)) {
    markedChildren = <span style={{ textDecoration: 'underline' }}>{markedChildren}</span>;
  }

  if (getLeafCase(ELementTypes.STRIKETHROUGH)) {
    markedChildren = <span style={{ textDecoration: 'line-through' }}>{markedChildren}</span>;
  }

  if (getLeafCase(ELementTypes.SUPERSCRIPT)) {
    markedChildren = <sup>{markedChildren}</sup>;
  }

  if (getLeafCase(ELementTypes.SUBSCRIPT)) {
    markedChildren = <sub>{markedChildren}</sub>;
  }

  if (getLeafCase(ELementTypes.CODE_LINE)) {
    markedChildren = <code>{markedChildren}</code>;
  }

  if (getLeafCase(ELementTypes.DELETE)) {
    markedChildren = <del>{markedChildren}</del>;
  }

  if (getLeafCase(ELementTypes.ADD)) {
    markedChildren = <span>{markedChildren}</span>;
  }

  if (getLeafCase(ELementTypes.decoration)) {
    markedChildren = <span className={`token ${leaf.type}`}>{markedChildren}</span>;
  }

  return (
    <span data-id={leaf.id} {...attributes} className={Object.keys(rest).join(' ')}>
      {markedChildren}
    </span>
  );
};

export default renderText;
