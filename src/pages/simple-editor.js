import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Loading from '../containers/loading';
import { mdStringToSlate, slateToMdString } from '../slate-convert';
import useMathJax from '../hooks/use-mathjax';
import SimpleMarkdownEditor from '../editors/simple-markdown-editor ';

const SimpleEditor = forwardRef(({ isFetching, value, editorApi, mathJaxSource, onValueChanged = () => {} }, ref) => {

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

  const onSave = useCallback((content) => {
    setRichValue(content);
    onValueChanged && onValueChanged();
  }, [onValueChanged]);

  const props = {
    isSupportFormula: !!mathJaxSource,
    value: richValue,
    editorApi: editorApi,
    onSave: onSave,
  };

  if (isFetching || isLoading || isLoadingMathJax) {
    return <Loading />;
  }

  return (
    <SimpleMarkdownEditor {...props} />
  );
});

export default SimpleEditor;
