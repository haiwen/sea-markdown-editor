import React, { useEffect, useState } from 'react';
import Loading from '../containers/loading';
import useMathJax from '../hooks/use-mathjax';
import SlateViewer from '../editors/slate-viewer';
import { mdStringToSlate } from '../slate-convert';

export default function MarkdownViewer({
  isFetching,
  value,
  mathJaxSource,
  isShowOutline,
  scrollRef,
  onLinkClick,
}) {

  const [richValue, setRichValue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoadingMathJax } = useMathJax(mathJaxSource);

  useEffect(() => {
    if (!isFetching) {
      const richValue = value ? JSON.parse(value) : mdStringToSlate('');
      setRichValue(richValue);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const props = {
    isSupportFormula: !!mathJaxSource,
    value: richValue,
    isShowOutline: isShowOutline,
    scrollRef: scrollRef,
    onLinkClick: onLinkClick,
  };

  if (isFetching || isLoading || isLoadingMathJax) {
    return <Loading />;
  }

  return (
    <SlateViewer {...props} />
  );
}
