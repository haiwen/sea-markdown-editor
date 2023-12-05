import React, { useEffect, useState } from 'react';
import Loading from '../containers/loading';
import { mdStringToSlate } from '../slate-convert';
import useMathJax from '../hooks/use-mathjax';
import SimpleMarkdownEditor from '../editors/simple-markdown-editor ';

export default function SimpleEditor({ isFetching, value, editorApi, mathJaxSource }) {

  const [richValue, setRichValue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoadingMathJax } = useMathJax(mathJaxSource);

  useEffect(() => {
    if (!isFetching) {
      const richValue = mdStringToSlate(value);
      setRichValue(richValue);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const onSave = () => {};

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
}
