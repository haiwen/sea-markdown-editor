import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string,
};

class MenuGroup extends React.PureComponent {

  static defaultProps = {
    className: 'menu-group'
  };

  render() {
    return (
      <div className={'btn-group ' + this.props.className} role={'group'}>
        {this.props.children}
      </div>
    );
  }
}

MenuGroup.propTypes = propTypes;

export default MenuGroup;
