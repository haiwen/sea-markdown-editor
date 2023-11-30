import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import { basicSetup, EditorView } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';

import './code-mirror.css';

const propTypes = {
  autoFocus: PropTypes.bool,
  initialValue: PropTypes.string,
};

class SeafileCodeMirror extends React.Component {

  state = {
    isFocused: false
  };

  componentDidMount() {
    const { initialValue, autoFocus } = this.props;
    this.view = new EditorView({
      doc: initialValue,
      extensions: [
        basicSetup,
        markdown({ codeLanguages: languages }),
        EditorView.updateListener.of((viewUpdate) => {
          this.onValueChanged(viewUpdate);
        })
      ],
      parent: this.codeMirrorRef,
    });
    if (autoFocus) this.focus();
  }

  componentWillUnmount() {
    if (this.view) {
      this.view.destroy();
    }
  }

  onValueChanged = (viewUpdate) => {
    const { onChange } = this.props;
    if (onChange && viewUpdate.docChanged) {
      const doc = viewUpdate.state.doc;
      const value = doc.toString();
      onChange(value);
    }
  };

  focus = () => {
    this.view.focus();
  };

  scrollIntoView = (pos) => {
    EditorView.scrollIntoView(pos);
  };


  setCodeMirrorRef = (ref) => {
    this.codeMirrorRef = ref;
  };

  render() {
    return (
      <div className={className('seafile-code-mirror', this.props.className)}>
        <div ref={this.setCodeMirrorRef} />
      </div>
    );
  }

}

SeafileCodeMirror.propTypes = propTypes;

export default SeafileCodeMirror;
