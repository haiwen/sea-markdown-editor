import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { nice } from 'slugid';
import Plugins from './plugins';

const baseEditor = Plugins.reduce((editor, pluginItem) => {
  const withPlugin = pluginItem.editorPlugin;
  if (withPlugin) {
    return withPlugin(editor);
  }
  editor._id = nice();
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
  editor._id = nice();
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
