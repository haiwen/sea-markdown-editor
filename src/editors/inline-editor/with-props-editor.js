const withPropsEditor = (editor, props = {}) => {
  let newEditor = editor;
  if (props.editorApi) {
    newEditor.api = props.editorApi;
  }

  if (props.onSave) {
    newEditor.onSave = props.onSave;
  }

  if (props.columns) {
    newEditor.columns = props.columns;
  }

  newEditor.isInlineEditor = true;

  return newEditor;
};

export default withPropsEditor;
