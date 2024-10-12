import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const OutlineItem = ({ node }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const onMouseOver = useCallback(() => {
    setIsHighlighted(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setIsHighlighted(false);
  }, []);

  const onItemClick = useCallback(() => {
    const { id } = node;
    document.getElementById(id).scrollIntoView();
  }, [node]);

  const className = classNames('sf-editor-outline-item', {
    'pl-5': node.type === 'header2',
    'pl-7': node.type === 'header3',
    'active': isHighlighted,
  });

  return (
    <div
      className={className}
      onClick={onItemClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {node.children.map(child => child.text).join('')}
    </div>
  );
};

OutlineItem.propTypes = {
  node: PropTypes.object,
};

export default OutlineItem;
