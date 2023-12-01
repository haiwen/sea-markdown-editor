import React, { useCallback, useEffect, useRef, useState } from 'react';
import MarkdownEditor from '../editors/markdown-editor';
import PlainMarkdownEditor from '../editors/plain-markdown-editor';
import Loading from '../containers/loading';
import { mdStringToSlate, slateToMdString } from '../slate-convert';

const EDITOR_MODE = {
  RICH: 'rich',
  PLAIN: 'plain'
};

export default function RichMarkdownEditor({ mode = EDITOR_MODE.RICH, isFetching, value, editorApi, onValueChanged }) {

  const currentMode = useRef(mode);
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

  useEffect(() => {
    if (mode !== currentMode.current && mode === EDITOR_MODE.RICH) {
      setIsLoading(true);
      queueMicrotask(() => {
        currentMode.current = mode;
        const newRichValue = mdStringToSlate(mdStringValue);
        setRichValue(newRichValue);
        setIsLoading(false);
      });
    }
    if (mode !== currentMode.current && mode === EDITOR_MODE.PLAIN) {
      setIsLoading(true);
      queueMicrotask(() => {
        currentMode.current = mode;
        const newMdStringValue = slateToMdString(richValue);
        setMdStringValue(newMdStringValue);
        setIsLoading(false);
      });
    }
  }, [mdStringValue, mode, richValue]);

  const onSave = useCallback((content) => {
    if (mode === EDITOR_MODE.RICH) {
      setRichValue(content);
    } else {
      setMdStringValue(content);
    }
  }, [mode]);

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
