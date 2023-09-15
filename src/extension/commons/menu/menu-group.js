import React from 'react';
import PropTypes from 'prop-types';

const MenuGroup = (props) => {
  return (
    <div className={'btn-group ' + props.className} role={'group'}>
      {props.children}
    </div>
  );
};

MenuGroup.defaultProps = {
  className: 'menu-group'
};

MenuGroup.propTypes = {
  className: PropTypes.string,
};

export default MenuGroup;
