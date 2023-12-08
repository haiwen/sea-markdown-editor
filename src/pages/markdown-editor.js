import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Loading from '../containers/loading';
import { mdStringToSlate, slateToMdString } from '../slate-convert';
import useMathJax from '../hooks/use-mathjax';
import SlateEditor from '../editors/slate-editor';

const SimpleEditor = forwardRef(({
  isFetching,
  value,
  editorApi,
  mathJaxSource,
  onSave: propsOnSave,
  onContentChanged: propsOnContentChanged,
  children
}, ref) => {

  const [richValue, setRichValue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoadingMathJax } = useMathJax(mathJaxSource);

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        const mdStringValue = slateToMdString(richValue);
        return mdStringValue;
      },
    };
  }, [richValue]);

  useEffect(() => {
    if (!isFetching) {
      const richValue = mdStringToSlate(value);
      setRichValue(richValue);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const onContentChanged = useCallback((content) => {
    setRichValue(content);
    propsOnContentChanged && propsOnContentChanged();
  }, [propsOnContentChanged]);

  const props = {
    isSupportFormula: !!mathJaxSource,
    value: richValue,
    editorApi: editorApi,
    onSave: propsOnSave,
    onContentChanged: onContentChanged,
    children: children,
  };

  if (isFetching || isLoading || isLoadingMathJax) {
    return <Loading />;
  }

  return (
    <SlateEditor {...props} />
  );
});

export default SimpleEditor;
