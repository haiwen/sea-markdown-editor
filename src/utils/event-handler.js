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

    // Disable the default 'save page'
    if (isHotkey('mod+s', event)) {
      event.preventDefault();
    }

    // Disable default 'tab' behavior
    if (isHotkey('tab', event)) {
      event.preventDefault();
    }
  };

  onCopy = (event) => {
    console.log('event', event)
    const editor = this.editor;
    if (editor.onCopy) {
      const isHandled = editor.onCopy(event);
      if (isHandled) return;
    }
  }
}

export default EventProxy;
