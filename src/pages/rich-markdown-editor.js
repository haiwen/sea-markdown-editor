import React, { useCallback, useEffect, useState } from 'react';
import MarkdownEditor from '../editors/markdown-editor';
import PlainMarkdownEditor from '../editors/plain-markdown-editor';
import Loading from '../containers/loading';
import { mdStringToSlate, slateToMdString } from '../slate-convert';

export default function RichMarkdownEditor({ mode, value, editorApi, onValueChanged }) {

  const [mdStringValue, setMdStringValue] = useState(value);
  const [richValue, setRichValue] = useState(value);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mode === 'rich') {
      const richValue = mdStringToSlate(value);
      setRichValue(richValue);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = useCallback((content) => {
    console.log('add');
    if (mode === 'rich') {
      const mdStringValue = slateToMdString(content);
      console.log(mdStringValue);
      setRichValue(content);
      setMdStringValue(mdStringValue);
    } else {
      const richValue = mdStringToSlate(content);
      setRichValue(richValue);
      console.log(richValue);
      setMdStringValue(content);
    }
    onValueChanged && onValueChanged(mdStringValue);
  }, [mdStringValue, mode, onValueChanged]);

  const props = {
    onSave: onSave,
    ...(mode === 'plain' && { value: mdStringValue }),
    ...(mode === 'rich' && { value: richValue }),
    ...(mode === 'rich' && { editorApi: editorApi })
  };

  console.log(props);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {mode === 'rich' && <MarkdownEditor {...props} />}
      {mode === 'plain' && <PlainMarkdownEditor {...props} />}
    </>
  );
}
