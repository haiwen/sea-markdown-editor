import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import Plugins from './plugins';

const baseEditor = Plugins.reduce((editor, pluginItem) => {
  const withPlugin = pluginItem.editorPlugin;
  if (withPlugin) {
    return withPlugin(editor);
  }
  return editor;
}, withHistory(withReact(createEditor())));

const createSlateEditor = () => {
  const editor = Plugins.reduce((editor, pluginItem) => {
    const withPlugin = pluginItem.editorPlugin;
    if (withPlugin) {
      return withPlugin(editor);
    }
    return editor;
  }, withHistory(withReact(createEditor())));
  return editor;
};

export {
  baseEditor,
  createSlateEditor,
};
