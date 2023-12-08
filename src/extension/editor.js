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

export default baseEditor;
