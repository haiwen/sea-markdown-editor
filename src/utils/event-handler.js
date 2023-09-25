import isHotkey from 'is-hotkey';

class EventProxy {

  constructor(editor) {
    this.editor = editor;
  }

  onKeyDown = (event) => {
    const editor = this.editor;

    if (editor.onHotKeyDown) {
      const isHandled = editor.onHotKeyDown(event);
      if (isHandled) return;
    }

    // bold
    if (isHotkey('mod+b', event)) {
      event.preventDefault();
      editor.toggleTextBold();
    }

    // italic
    if (isHotkey('mod+i', event)) {
      event.preventDefault();
      editor.toggleTextItalic();
    }

    // disable the default 'save page'
    if (isHotkey('mod+s', event)) {
      event.preventDefault();
    }
  };
}

export default EventProxy;
