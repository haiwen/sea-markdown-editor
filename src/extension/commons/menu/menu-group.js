import React from 'react';
import PropTypes from 'prop-types';

const MenuGroup = ({ className = 'sf-menu-group', children }) => {
  return (
    <div className={'btn-group ' + className} role={'group'}>
      {children}
    </div>
  );
};

MenuGroup.propTypes = {
  className: PropTypes.string,
};

export default MenuGroup;
