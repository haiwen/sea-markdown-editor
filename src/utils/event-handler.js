import isHotkey from 'is-hotkey';
import EventBus from '../utils/event-bus';
import { getSelectedNodeByType } from '../extension/core/queries/';
import * as ELEMENT_TYPE from '../extension/constants/element-types';
import { INTERNAL_EVENTS } from '../constants/event-types';

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

    // font scale
    if (isHotkey('opt+.', event)) {
      event.preventDefault();
      editor.increaseFontSize();
    }

    if (isHotkey('opt+,', event)) {
      event.preventDefault();
      editor.reduceFontSize();
    }

    // disable the default 'save page'
    if (isHotkey('mod+s', event)) {
      event.preventDefault();
    }

    // redo
    if (isHotkey('mod+y', event)) {
      event.preventDefault();
      const { history } = editor;
      if (history.redos.length === 0) {
        return false;
      }
      editor.redo();
    }

    // undo
    if (isHotkey('mod+z', event)) {
      event.preventDefault();
      const { history } = editor;
      if (history.undos.length === 0) {
        return false;
      }
      editor.undo();
    }

    if (isHotkey('tab', event) || isHotkey('shift+tab', event)) {
      editor.handleTab && editor.handleTab(event);
    }

    const node = getSelectedNodeByType(editor, ELEMENT_TYPE.TABLE);
    if (node) {
      this.editor.tableOnKeyDown(event);
    }
    const imageNode = getSelectedNodeByType(editor, ELEMENT_TYPE.IMAGE);
    if (imageNode) {
      this.editor.imageOnKeyDown(event);
    }
    if (getSelectedNodeByType(editor, ELEMENT_TYPE.CODE_BLOCK)) {
      this.editor.codeBlockOnKeyDown(event);
      const eventBus = EventBus.getInstance();
      eventBus.dispatch(INTERNAL_EVENTS.HIDDEN_CODE_BLOCK_HOVER_MENU);
    }
  };

  onCopy = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    // 处理数据
  };

  onCut = (event) => {
    if (this.editor.cut) {
      this.editor.cut(event);
    }
  };

  onPaste = (event) => {

  };

}

export default EventProxy;
