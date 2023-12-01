import React from 'react';
import isHotkey from 'is-hotkey';
import PropTypes from 'prop-types';
import processor from '../../slate-convert/md-to-html';
import SeafileCodeMirror from './code-mirror';

import './style.css';

const propTypes = {
  autoFocus: PropTypes.bool,
  value: PropTypes.string,
  onSave: PropTypes.func,
};

class PlainMarkdownEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorValue: props.value,
      previewValue: '',
      isMouseInLeftSide: false,
      isMouseInRightSide: false
    };
  }

  /*
  *   the data about scroll, these variable has nothing to width react
  *   they are not state
  * */
  scrollData = {
    scrollPercentage: 0,
    leftPanel: null,
    rightPanel: null,
  };

  componentDidMount() {
    // get relevant dom when component mounted instead of get them when scrolling to improve performance
    this.scrollData.leftPanel = document.querySelector('.plain-editor-left-panel');
    this.scrollData.rightPanel = document.querySelector('.plain-editor-right-panel');
    this.setContent(this.props.value);
  }

  componentDidUpdate() {
    // render math formula
    // window.MathJax.typesetPromise(document.querySelectorAll('.math-display'));
  }

  setContent = (markdownContent) => {
    this.setState({ editorValue: markdownContent });
    processor.process(markdownContent, (error, vfile) => {
      var html = String(vfile);
      this.setState({ previewValue: html });
    });
  };

  updateCode = (newCode) => {
    this.setContent(newCode);
    this.props.onSave && this.props.onSave(newCode);
  };

  onEnterLeftPanel = () => {
    this.setState({ isMouseInLeftSide: true });
  };

  onLeaveLeftPanel = () => {
    this.setState({ isMouseInLeftSide: false });
  };

  onLeftScroll = (e) => {
    const { isMouseInLeftSide } = this.state;
    if (!isMouseInLeftSide) return;
    let srcElement = this.scrollData.leftPanel;
    this.scrollData.scrollPercentage = srcElement.scrollTop / srcElement.scrollHeight;
    this.scrollData.rightPanel.scrollTop = this.scrollData.scrollPercentage * this.scrollData.rightPanel.scrollHeight;
  };

  onEnterRightPanel = () => {
    this.setState({ isMouseInRightSide: true });
  };

  onLeaveRightPanel = () => {
    this.setState({ isMouseInRightSide: false });
  };

  onRightScroll = (e) => {
    const { isMouseInRightSide } = this.state;
    if (!isMouseInRightSide) return;
    let srcElement = this.scrollData.rightPanel;
    this.scrollData.scrollPercentage = srcElement.scrollTop / srcElement.scrollHeight;
    this.scrollData.leftPanel.scrollTop = this.scrollData.scrollPercentage * this.scrollData.leftPanel.scrollHeight;
  };

  onHotKey = (event) => {
    const { onSave } = this.props;
    if (isHotkey('mod+s', event)) {
      event.preventDefault();
      onSave && onSave(this.state.editorValue);
      return true;
    }
  };

  render() {
    const { editorValue, previewValue } = this.state;

    return (
      <div className='plain-editor seafile-editor-module'>
        <div className="plain-editor-main d-flex" onKeyDown={this.onHotKey}>
          <div
            className="plain-editor-left-panel"
            onMouseLeave={this.onLeaveLeftPanel}
            onMouseEnter={this.onEnterLeftPanel}
            onScroll={this.onLeftScroll}
          >
            <SeafileCodeMirror autoFocus={true} initialValue={editorValue} onChange={this.updateCode} />
          </div>
          <div
            className="plain-editor-right-panel"
            onMouseEnter={this.onEnterRightPanel}
            onMouseLeave={this.onLeaveRightPanel}
            onScroll={this.onRightScroll}
          >
            <div className="preview">
              <div className="rendered-markdown article" dangerouslySetInnerHTML={{ __html: previewValue }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

PlainMarkdownEditor.propTypes = propTypes;

export default PlainMarkdownEditor;
