import React, { cloneElement, isValidElement, useEffect, useState } from 'react';
import Loading from '../containers/loading';
import { mdStringToSlate } from '../slate-convert';
import useMathJax from '../hooks/use-mathjax';
import SlateViewer from '../editors/slate-viewer';

/**
 *
 * @param {
 *   options: {
 *     loading: {
 *       render: Custom loading renderer,
 *       ... // others
 *     },
 *     [ELementTypes.LINK_REFERENCE]: {
 *       render: Custom LinkReference renderer
 *     },
 *     ... // others
 *   }
 * }
 * @returns SlateViewer
 */

export default function MarkdownViewer({
  isFetching,
  isShowLoading = true,
  value,
  mathJaxSource,
  isShowOutline,
  scrollRef,
  onLinkClick,
  beforeRenderCallback,
  options,
}) {

  const [richValue, setRichValue] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(isShowLoading));
  const { isLoadingMathJax } = useMathJax(mathJaxSource);

  useEffect(() => {
    if (!isFetching) {
      if (isShowLoading) {
        setIsLoading(true);
      }
      const richValue = mdStringToSlate(value);
      beforeRenderCallback && beforeRenderCallback(richValue);
      setRichValue(richValue);
      if (isShowLoading) {
        setTimeout(() => {
          setIsLoading(false);
        }, 0);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, value, isShowLoading]);

  const props = {
    options,
    isSupportFormula: !!mathJaxSource,
    value: richValue,
    isShowOutline: isShowOutline,
    scrollRef: scrollRef,
    onLinkClick: onLinkClick,
  };

  if (isShowLoading && (isFetching || isLoading || isLoadingMathJax)) {
    const loadingOption = options?.loading || {};
    const { render } = loadingOption || {};
    if (render && isValidElement(render)) {
      return cloneElement(render);
    }
    return <Loading />;
  }

  return (
    <SlateViewer {...props} />
  );
}
