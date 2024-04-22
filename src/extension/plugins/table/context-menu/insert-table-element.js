import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import isHotkey from 'is-hotkey';
import { TABLE_MAX_COLUMNS, TABLE_MAX_ROWS, TABLE_ELEMENT, TABLE_ELEMENT_POSITION } from '../constant';
import { withTranslation } from 'react-i18next';

const propTypes = {
  type: PropTypes.string,
  count: PropTypes.number,
  position: PropTypes.string,
  insertTableElement: PropTypes.func,
  t: PropTypes.func,
};

class InsertTableElement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: props.count || 1,
    };
    this.maxCount = props.type === TABLE_ELEMENT.ROW ? TABLE_MAX_ROWS : TABLE_MAX_COLUMNS;
  }

  insertTableElement = () => {
    const { type, position } = this.props;
    const { count } = this.state;
    this.props.insertTableElement(type, position, count);
  };

  getTip = () => {
    const { type, position, t } = this.props;
    if (type === TABLE_ELEMENT.ROW) {
      return position === TABLE_ELEMENT_POSITION.AFTER ? t('Insert_below') : t('Insert_above');
    }
    return position === TABLE_ELEMENT_POSITION.AFTER ? t('Insert_on_the_right') : t('Insert_on_the_left');
  };

  onMouseDown = (e) => {
    e.stopPropagation();
  };

  onKeyDown = (event) => {
    if (isHotkey('enter', event)) {
      event.preventDefault();
      this.insertTableElement();
      return;
    }
  };

  onChange = (event) => {
    const value = event.target.value || '0';
    const newValue = value ? value.replace(/[^\d,]/g, '') : value;
    if (newValue === this.state.count) return;
    const { currentCount } = this.props;
    const numberValue = parseInt(newValue);
    if (currentCount + numberValue > this.maxCount) {
      this.setState({ count: this.maxCount - currentCount });
      return;
    }
    this.setState({ count: numberValue });
  };

  render() {
    const { count } = this.state;
    const { t, type, currentCount } = this.props;
    const isDisabled = currentCount >= this.maxCount;

    return (
      <button
        onMouseDown={this.insertTableElement}
        className="sf-context-menu-item sf-dropdown-menu-item"
        disabled={isDisabled}
      >
        {this.getTip()}
        <div className="insert-number">
          <Input
            className="insert-number-input"
            value={count}
            disabled={isDisabled}
            onMouseDown={this.onMouseDown}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
          />
          <span>{type === TABLE_ELEMENT.ROW ? t('Row(s)') : t('Column(s)')}</span>
        </div>
      </button>
    );
  }
}

InsertTableElement.propTypes = propTypes;

export default withTranslation('seafile-editor')(InsertTableElement);
