import { createSdocEditor, formatChildren2 } from '../utils';

class StubEditor {

  constructor(input, plugins = []) {
    if (!input) {
      throw new Error('Param input is required');
    }
    this.editor = createSdocEditor(input, plugins);
  }

  getEditor = () => {
    return this.editor;
  };

  getContent = () => {
    return formatChildren2(this.editor.children);
  };

  getStringContent = () => {
    return JSON.stringify(this.getContent());
  };

}

export default StubEditor;
