import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';

const FallbackEditor = ({
  enableEdit,
  value: propsValue,
  onChange: propsOnChange,
  closeEditor,
}) => {
  const [value, setValue] = useState(propsValue);
  const showEditorRef = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (enableEdit === showEditorRef.current) return;
    if (enableEdit && !showEditorRef.current) {
      setTimeout(() => inputRef.current.focus() );
    }
  }, [enableEdit]);

  const onChange = useCallback((event) => {
    const newValue = event.target.value;
    if (newValue === value) return;
    setValue(newValue);
    propsOnChange && propsOnChange({
      text: newValue,
      preview: newValue ? newValue.slice(0, 30) : '',
      links: [],
      images: []
    });
  }, [value, propsOnChange]);

  const onKeyDown = useCallback((e) => {
    let { selectionStart, selectionEnd, value } = e.currentTarget;
    if (isHotkey('enter', e)) {
      e.preventDefault();
      closeEditor && closeEditor();
      inputRef.current.blur();
    } else if ((e.keyCode === 37 && selectionStart === 0) ||
      (e.keyCode === 39 && selectionEnd === value.length)
    ) {
      e.stopPropagation();
    }
  }, [closeEditor]);

  const onPaste = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const onCut = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <textarea
      className="form-control sf-long-text-inline-fallback-editor-container"
      ref={inputRef}
      rows={5}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onCut={onCut}
    />
  );
};

FallbackEditor.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isEditorShow: PropTypes.bool,
  updateTabIndex: PropTypes.func,
};

export default FallbackEditor;
