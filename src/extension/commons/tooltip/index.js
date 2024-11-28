import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
import classnames from 'classnames';

import './index.css';

const Tooltip = ({ target, children, className, placement }) => {

  const popperClassName = classnames('sf-tooltip', className);

  const props = {
    popperClassName,
    target,
    fade: false,
    placement: placement || 'bottom',
    delay: 0,
    boundariesElement: 'body',
  };
  return (
    <UncontrolledTooltip {...props}>
      {children}
    </UncontrolledTooltip>
  );
};

Tooltip.propTypes = {
  target: PropTypes.string.isRequired,
  className: PropTypes.string,
  placement: PropTypes.string,
  children: PropTypes.any,
};

export default Tooltip;
