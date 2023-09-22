import React, { useCallback, useState, useMemo } from 'react';
import { Editable, Slate } from 'slate-react';
import { baseEditor, Toolbar, renderElement, renderLeaf } from '../../extension';
import SeafileHelp from './markdown-help';
import EventBus from '../../utils/event-bus';
import EventProxy from '../../utils/event-handler';
import '../../assets/css/markdown-editor.css';
import EditorContext from '../../containers/editor-expand';
import PropTypes from 'prop-types';

MarkdownEditor.propTypes = {
  isReadonly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  editorApi: PropTypes.object.isRequired,
};

export default function MarkdownEditor(props) {
  const { isReadonly, value } = props;
  const [slateValue, setSlateValue] = useState(value);
  const expandedEditor = useMemo(() => {
    const newEditor = EditorContext.getEditor.call({ editor: baseEditor },props);
    return newEditor;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const eventProxy = useMemo(() => {
    return new EventProxy(expandedEditor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = useCallback((value) => {
    setSlateValue(value);
    const eventBus = EventBus.getInstance();
    eventBus.dispatch('change');
  }, []);

  return (
    <div className='sf-markdown-editor-container'>
      {!isReadonly && <Toolbar editor={expandedEditor} readonly={isReadonly} />}
      <div className='sf-markdown-editor-content'>
        <Slate editor={expandedEditor} initialValue={slateValue} onChange={onChange}>
          <div className='sf-markdown-scroll-container'>
            <div className='sf-markdown-article-container'>
              <div className='article'>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  onKeyDown={eventProxy.onKeyDown}
                />
              </div>
            </div>
          </div>
          <SeafileHelp />
        </Slate>
      </div>
    </div >
  );
}
