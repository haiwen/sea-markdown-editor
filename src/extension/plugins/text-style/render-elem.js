import React from 'react';
import { TEXT_STYLE_MAP } from '../../constants';

const renderText = (props, editor) => {
  const { attributes, children, leaf } = props;
  const { text, ...rest } = leaf;

  let markedChildren = React.cloneElement(children);

  if (leaf[TEXT_STYLE_MAP.BOLD]) {
    markedChildren = <strong>{markedChildren}</strong>;
  }

  if (leaf[TEXT_STYLE_MAP.ITALIC]) {
    markedChildren = <i>{markedChildren}</i>;
  }

  if (leaf[TEXT_STYLE_MAP.UNDERLINE]) {
    markedChildren = <span style={{ textDecoration: 'underline' }}>{markedChildren}</span>;
  }

  if (leaf[TEXT_STYLE_MAP.CODE]) {
    markedChildren = <code>{markedChildren}</code>;
  }

  if (leaf[TEXT_STYLE_MAP.DELETE]) {
    markedChildren = <del>{markedChildren}</del>;
  }

  if (leaf[TEXT_STYLE_MAP.ADD]) {
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
