import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';

class EditorExpand {
  constructor() {
    this.editor = null;
    this.tableUtils = null;
    this.editorUtils = null;
  }

  static getEditor(options) {
    if (this.editor && options) {
      if (options && options.editorApi) {
        this.editor.editorApi = options.editorApi;
      }
    }

    if (this.editor) return this.editor;
    this.editor = withHistory(withReact(createEditor()));
    if (options && options.onSave) {
      this.editor.onSave = options.onSave;
    }
    if (options && options.editorApi) {
      this.editor.editorApi = options.editorApi;
    }
    if (options && options.columns) {
      this.editor.columns = options.columns;
    }
    return this.editor;
  }

  static resetEditor() {
    this.editor = null;
    this.editorUtils = null;
    this.tableUtils = null;
  }

  static getEditorRef() {
    const editorRef = window.abcdef_editor;
    return editorRef;
  }

  static getToolbarRef() {
    const toolbarRef = window.abcdef_editorToolbar;
    return toolbarRef;
  }


}

export default EditorExpand;
