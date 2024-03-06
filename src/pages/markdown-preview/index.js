import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../../containers/loading';
import MarkdownViewer from '../markdown-view';
import { processor } from '../../slate-convert';

import './style.css';

const propTypes = {
  isWindowsWechat: PropTypes.bool,
  isShowOutline: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

// Windows old Wechat (3.0 or earlier) inner core is chrome 53 and don't support ECMA6, can't use seafile-editor markdownViewer
// Windows new Wechat (lastest version 3.3.5) support seafile-editor markdownViewer
// so use dangerouslySetInnerHTML to preview
class MarkdownPreview extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      innerHtml: null,
    };
  }

  componentDidMount() {
    const { isWindowsWechat, value }  = this.props;
    if (isWindowsWechat) {
      this.convertMarkdown(value);
    }
  }

  convertMarkdown = (mdFile) => {
    processor.process(mdFile).then((result) => {
      let innerHtml = String(result).replace(/<a /ig, '<a target="_blank" tabindex="-1"');
      this.setState({ innerHtml });
    });
  };

  render() {
    const { isWindowsWechat, value, isShowOutline }  = this.props;
    const { innerHtml } = this.state;
    if (isWindowsWechat && innerHtml === null) {
      return <Loading />;
    }

    return (
      <div className='longtext-preview-container'>
        {isWindowsWechat && (
          <div className="article" dangerouslySetInnerHTML={{ __html: this.state.innerHtml }}></div>
        )}
        {!isWindowsWechat && (
          <MarkdownViewer value={value} isShowOutline={isShowOutline} />
        )}
      </div>
    );
  }
}

MarkdownPreview.propTypes = propTypes;

export default MarkdownPreview;
