import React, { useCallback, useEffect, useState } from 'react';
import MarkdownEditor from '../editors/markdown-editor';
import PlainMarkdownEditor from '../editors/plain-markdown-editor';
import Loading from '../containers/loading';
import { mdStringToSlate, slateToMdString } from '../slate-convert';

const EDITOR_MODE = {
  RICH: 'rich',
  PLAIN: 'plain'
};

export default function RichMarkdownEditor({ mode = EDITOR_MODE.RICH, isFetching, value, editorApi, onValueChanged }) {

  const [mdStringValue, setMdStringValue] = useState('');
  const [richValue, setRichValue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFetching) {
      const richValue = mdStringToSlate(value);
      setRichValue(richValue);
      setMdStringValue(value);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const onSave = useCallback((content) => {
    if (mode === EDITOR_MODE.RICH) {
      const mdStringValue = slateToMdString(content);
      setRichValue(content);
      setMdStringValue(mdStringValue);
      onValueChanged && onValueChanged(mdStringValue);
    } else {
      const richValue = mdStringToSlate(content);
      setRichValue(richValue);
      setMdStringValue(content);
      onValueChanged && onValueChanged(content);
    }
  }, [mode, onValueChanged]);

  const props = {
    onSave: onSave,
    ...(mode === EDITOR_MODE.PLAIN && { value: mdStringValue }),
    ...(mode === EDITOR_MODE.RICH && { value: richValue }),
    ...(mode === EDITOR_MODE.RICH && { editorApi: editorApi })
  };

  if (isFetching || isLoading) {
    return <Loading />;
  }

  return (
    <>
      {mode === 'rich' && <MarkdownEditor {...props} />}
      {mode === 'plain' && <PlainMarkdownEditor {...props} />}
    </>
  );
}
