import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Loading from '../containers/loading';
import { mdStringToSlate, slateToMdString } from '../slate-convert';
import useMathJax from '../hooks/use-mathjax';
import SimpleSlateEditor from '../editors/simple-slate-editor ';

const SeaTableEditor = forwardRef(({
  isFetching,
  value,
  editorApi,
  mathJaxSource,
  columns,
  onSave: propsOnSave,
  onContentChanged: propsOnContentChanged,
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
    columns: columns,
    onSave: propsOnSave,
    onContentChanged: onContentChanged,
  };

  if (isFetching || isLoading || isLoadingMathJax) {
    return <Loading />;
  }

  return (
    <SimpleSlateEditor {...props} />
  );
});

export default SeaTableEditor;
