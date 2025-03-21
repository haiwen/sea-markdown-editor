import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import Tooltip from '../tooltip';
import { TRANSLATE_NAMESPACE } from '../../../constants';

const MenuItem = ({ disabled, isActive, isRichEditor = true, type, onMouseDown, className = 'sf-menu-group-item', iconClass, id, text }) => {

  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const onClick = useCallback((event) => {
    if (disabled) return;
    onMouseDown(event, type);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, type, onMouseDown]);

  const validClassName = classnames(className, {
    'sf-rich-editor': isRichEditor,
    'sf-icon-btn': true,
    'sf-icon-btn-disabled': disabled,
    'sf-icon-btn-hover': !disabled,
  });

  return (
    <>
      <button
        id={id}
        type="button"
        className={validClassName}
        disabled={disabled}
        data-active={isActive}
        onClick={onClick}
      >
        <i className={iconClass} />
      </button>
      <Tooltip target={id} transition={{ timeout: 150 }}>
        {t(text)}
      </Tooltip>
    </>
  );

};

MenuItem.propTypes = {
  isRichEditor: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onMouseDown: PropTypes.func,
};

export default MenuItem;
