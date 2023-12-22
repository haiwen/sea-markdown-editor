import React from 'react';
import PropTypes from 'prop-types';
import Menu from './menu';
import { withTranslation } from 'react-i18next';

const propTypes = {
  option: PropTypes.object,
  onUpdateOption: PropTypes.func,
  t: PropTypes.func,
};

class FieldSetting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowMenu: false,
      position: {
        top: 0,
        left: 0,
      }
    };
  }

  onMouseEnter = () => {
    if (!this.props.option) return;

    const container = this.settingRef;
    const { height, width } = container.getBoundingClientRect();
    const position = {
      height,
      width,
    };
    this.setState({
      isShowMenu: true,
      position,
    });
  };

  onMouseLeave = () => {
    this.setState({ isShowMenu: true });
  };

  onBoldClick = (event) => {
    event.stopPropagation();
    const { option } = this.props;
    const newOption = { ...option, bold: !option.bold };
    this.props.onUpdateOption(newOption);
  };

  onItalicClick = (event) => {
    event.stopPropagation();
    const { option } = this.props;
    const newOption = { ...option, italic: !option.italic };
    this.props.onUpdateOption(newOption);
  };

  setSettingRef = (ref) => {
    this.settingRef = ref;
  };

  render() {

    const { option, t } = this.props;
    const isDisable = !option;
    const { bold: isBold, italic: isItalic } = option || {};

    const { isShowMenu } = this.state;
    const className = `sf-field-setting ${isDisable ? 'disable' : ''} option-item`;

    return (
      <span ref={this.setSettingRef} className={className} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <span className='iconfont icon-text-style'/>
        <span className="label">{t('Font_style')}</span>
        <span className="icon-container">
          <span className="iconfont icon-caret-up op-icon"></span>
        </span>
        {isShowMenu && (
          <Menu position={this.state.position}>
            <Menu.Item
              iconClass={'iconfont icon-bold'}
              isChecked={isBold}
              onClick={this.onBoldClick}
            >
              {t('bold')}
            </Menu.Item>
            <Menu.Item
              iconClass={'iconfont icon-italic'}
              isChecked={isItalic}
              onClick={this.onItalicClick}
            >
              {t('italic')}
            </Menu.Item>
          </Menu>
        )}
      </span>
    );
  }
}

FieldSetting.propTypes = propTypes;

export default withTranslation('seafile-editor')(FieldSetting);
