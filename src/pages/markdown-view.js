import React, { useEffect, useState } from 'react';
import Loading from '../containers/loading';
import { mdStringToSlate } from '../slate-convert';
import useMathJax from '../hooks/use-mathjax';
import SlateViewer from '../editors/slate-viewer';

export default function MarkdownViewer({ isFetching, value, mathJaxSource, isShowOutline }) {

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

  const props = {
    isSupportFormula: !!mathJaxSource,
    value: richValue,
    isShowOutline: isShowOutline,
  };

  if (isFetching || isLoading || isLoadingMathJax) {
    return <Loading />;
  }

  return (
    <SlateViewer {...props} />
  );
}
