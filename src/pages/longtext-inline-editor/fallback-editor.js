import React, { forwardRef, useCallback, useEffect, useRef, useState, useImperativeHandle, useMemo } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import { nice } from 'slugid';
import EventBus from '../../utils/event-bus';
import { EXTERNAL_EVENTS } from '../../constants/event-types';

const FallbackEditor = forwardRef(({
  enableEdit,
  value: propsValue,
  onChange: propsOnChange,
  closeEditor,
}, ref) => {
  const [value, setValue] = useState(propsValue);
  const showEditorRef = useRef(false);
  const inputRef = useRef(null);

  const editor = useMemo(() => ({ _id: nice(4) }), []);

  useEffect(() => {
    if (enableEdit === showEditorRef.current) return;
    if (enableEdit && !showEditorRef.current) {
      setTimeout(() => inputRef.current.focus() );
    }
  }, [enableEdit]);

  const handleClear = useCallback((targetEditor) => {
    if (targetEditor._id !== editor._id) return;
    setValue('');
    inputRef.current.focus();
  }, [editor]);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const clearSubscribe = eventBus.subscribe(EXTERNAL_EVENTS.CLEAR_ARTICLE, handleClear);
    return () => {
      clearSubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = useCallback((event) => {
    const newValue = event.target.value;
    if (newValue === value) return;
    setValue(newValue);
  }, [value]);

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

  useEffect(() => {
    propsOnChange && propsOnChange({
      text: value,
      preview: value ? value.slice(0, 30) : '',
      links: [],
      images: []
    });
  }, [value, propsOnChange]);

  useImperativeHandle(ref, () => {
    return {
      getEditor: () => editor,
    };
  }, [editor]);

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
});

FallbackEditor.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isEditorShow: PropTypes.bool,
  updateTabIndex: PropTypes.func,
};

export default FallbackEditor;
