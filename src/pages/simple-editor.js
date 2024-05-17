import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../containers/loading';
import { mdStringToSlate, slateToMdString } from '../slate-convert';
import useMathJax from '../hooks/use-mathjax';
import SimpleSlateEditor from '../editors/simple-slate-editor';
import InlineEditor from '../editors/inline-editor';

const SimpleEditor = forwardRef(({
  isInline,
  isFetching,
  value,
  editorApi,
  mathJaxSource,
  onSave: propsOnSave,
  onContentChanged: propsOnContentChanged,
  ...otherProps
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
      getSlateValue: () => {
        return richValue;
      }
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
    ...otherProps
  };

  if (isFetching || isLoading || isLoadingMathJax) {
    return <Loading />;
  }

  if (isInline) {
    return (<InlineEditor {...props} />);
  }

  return (
    <SimpleSlateEditor {...props} />
  );
});


SimpleEditor.propTypes = {
  isInline: PropTypes.bool,
  isFetching: PropTypes.bool,
  value: PropTypes.string,
  editorApi: PropTypes.object,
  mathJaxSource: PropTypes.string,
  onSave: PropTypes.func,
  onContentChanged: PropTypes.func,
};

export default SimpleEditor;
