import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import SlateEditor from '../editors/slate-editor';
import PlainMarkdownEditor from '../editors/plain-markdown-editor';
import Loading from '../containers/loading';
import { mdStringToSlate, slateToMdString } from '../slate-convert';
import useMathJax from '../hooks/use-mathjax';
import { generateHeaderElement } from '../extension/core';

const EDITOR_MODE = {
  RICH: 'rich',
  PLAIN: 'plain'
};

const RichMarkdownEditor = forwardRef(({
  mode = EDITOR_MODE.RICH,
  isFetching,
  initValue,
  value,
  editorApi,
  onSave: propsOnSave,
  onContentChange: propsOnContentChange,
  mathJaxSource,
  children
}, ref) =>  {

  const currentMode = useRef(mode);
  const [mdStringValue, setMdStringValue] = useState('');
  const [richValue, setRichValue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoadingMathJax } = useMathJax(mathJaxSource);

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        if (mode === EDITOR_MODE.RICH) {
          const newValue = slateToMdString(richValue);
          return newValue;
        } else {
          return mdStringValue;
        }
      },
    };
  }, [mdStringValue, mode, richValue]);

  useEffect(() => {
    if (!isFetching) {
      let richValue = mdStringToSlate(value);
      if (!value && initValue) {
        richValue = [generateHeaderElement(initValue)];
      }
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
    propsOnSave && propsOnSave();
  }, [mode, propsOnSave]);

  const props = {
    onSave: onSave,
    onContentChange: propsOnContentChange,
    isSupportFormula: !!mathJaxSource,
    ...(children && { children }),
    ...(mode === EDITOR_MODE.PLAIN && { value: mdStringValue }),
    ...(mode === EDITOR_MODE.RICH && { value: richValue }),
    ...(mode === EDITOR_MODE.RICH && { editorApi: editorApi })
  };

  if (isFetching || isLoading || isLoadingMathJax) {
    return <Loading />;
  }

  return (
    <>
      {mode === 'rich' && <SlateEditor {...props} />}
      {mode === 'plain' && <PlainMarkdownEditor {...props} />}
    </>
  );
});

export default RichMarkdownEditor;
