import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import renderElement from './render/render-element';
import renderLeaf from './render/render-leaf';
import Plugins from './plugins';
import { Toolbar } from './toolbar';

const baseEditor = withHistory(withReact(createEditor()));

const defaultEditor = Plugins.reduce((editor, pluginItem) => {
  const withPlugin = pluginItem.editorPlugin;
  if (withPlugin) {
    return withPlugin(editor);
  }
  return editor;
}, baseEditor);

export default defaultEditor;

export {
  renderElement,
  renderLeaf,
  Toolbar,
};

