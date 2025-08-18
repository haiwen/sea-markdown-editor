
const withPropsEditor = (editor, props = {}) => {
  const newEditor = editor;
  if (props.editorApi) {
    newEditor.api = props.editorApi;
  }

  if (props.onSave) {
    newEditor.onSave = props.onSave;
  }

  newEditor.isImageUploadOnly = props.isImageUploadOnly === undefined ? true : Boolean(props.isImageUploadOnly);

  newEditor.isSupportMultipleFiles = Boolean(props.isSupportMultipleFiles);

  return newEditor;
};

export default withPropsEditor;
