import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const propTypes = {
  containerClass: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onModalClick: PropTypes.func,
};

class LongTextModal extends React.Component {

  constructor(props) {
    super(props);
    const { containerClass } = this.props;
    this.el = document.createElement('div');
    this.el.className = 'longtext-modal-wrapper';
    this.el.className = `longtext-modal-wrapper ${containerClass || ''}`;
    document.body.appendChild(this.el);
  }

  componentDidMount() {
    this.el.addEventListener('mousedown', this.onModalClick);
  }

  componentWillUnmount() {
    this.el.removeEventListener('mousedown', this.onModalClick);
    document.body.removeChild(this.el);
  }

  onModalClick = (e) => {
    const isClickInside = this.el && this.el.contains(e.target) && this.el !== e.target;
    if (isClickInside) return;
    e && e.stopPropagation();
    e && e.stopImmediatePropagation();
    const className = e.target.className;
    if (typeof className !== 'string') return;
    if (this.props.onModalClick && (className === 'longtext-modal-wrapper' || className.startsWith('longtext-modal-wrapper') )) {
      this.props.onModalClick();
    }
  };

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

LongTextModal.propTypes = propTypes;
export default LongTextModal;
