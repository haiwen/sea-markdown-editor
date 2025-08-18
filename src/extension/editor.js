import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import Plugins from './plugins';
import { nice } from 'slugid';

const baseEditor = Plugins.reduce((editor, pluginItem) => {
  const withPlugin = pluginItem.editorPlugin;
  if (withPlugin) {
    return withPlugin(editor);
  }
  return editor;
}, withHistory(withReact(createEditor())));

const inlineEditor = () => {
  const editor = Plugins.reduce((editor, pluginItem) => {
    const withPlugin = pluginItem.editorPlugin;
    if (withPlugin) {
      return withPlugin(editor);
    }
    return editor;
  }, withHistory(withReact(createEditor())));
  return editor;
};

const createSlateEditor = () => {
  const editor = Plugins.reduce((editor, pluginItem) => {
    const withPlugin = pluginItem.editorPlugin;
    if (withPlugin) {
      return withPlugin(editor);
    }
    return editor;
  }, withHistory(withReact(createEditor())));
  editor._id = nice();
  return editor;
};

export {
  inlineEditor,
  baseEditor,
  createSlateEditor,
};
