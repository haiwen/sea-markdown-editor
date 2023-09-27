
const withPropsEditor = (editor, props = {}) => {
  const newEditor = editor;
  if (props.editorApi) {
    newEditor.api = props.editorApi;
  }

  if (props.onSave) {
    newEditor.onSave = props.onSave;
  }

  return newEditor;
};

export default withPropsEditor;
