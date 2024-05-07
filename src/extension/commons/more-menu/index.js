import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { UncontrolledPopover } from 'reactstrap';
import { MENUS_CONFIG_MAP, MORE_OPERATION } from '../../constants';

import './index.css';

const MoreMenu = ({ className, disabled, isRichEditor, children }) => {
  const validClassName = classnames(className, {
    'sf-rich-editor': isRichEditor,
    'sf-icon-btn': true,
    'sf-icon-btn-disabled': disabled,
    'sf-icon-btn-hover': !disabled,
  });
  const config = MENUS_CONFIG_MAP[MORE_OPERATION];

  return (
    <>
      <button className={validClassName} type="button" id={config.id}>
        <i className={config.iconClass}></i>
      </button>
      <UncontrolledPopover
        target={config.id}
        className="sf-editor-menu-popover sf-editor--more-menu-popover"
        trigger="legacy"
        placement="bottom-end"
        hideArrow={true}
        fade={false}
      >
        {children}
      </UncontrolledPopover>
    </>
  );
};

MoreMenu.defaultProps = {
  isRichEditor: true,
  className: 'sf-menu-group-item',
};

MoreMenu.propTypes = {
  disabled: PropTypes.bool,
  isRichEditor: PropTypes.bool,
  children: PropTypes.array.isRequired,
  classnames: PropTypes.string,
};

export default MoreMenu;
