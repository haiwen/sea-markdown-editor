import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const OutlineItem = ({ node }) => {
  const onItemClick = useCallback(() => {
    const { node } = this.props;
    const { id } = node;
    document.getElementById(id).scrollIntoView();
  }, []);

  const className = classNames({
    'outline-h2': node.type === 'header2',
    'outline-h3': node.type === 'header3',
  });

  return (
    <div className={className} onClick={onItemClick}>
      {node.children.map(child => child.text).join('')}
    </div>
  );
};

OutlineItem.propTypes = {
  node: PropTypes.object,
};

export default OutlineItem;
