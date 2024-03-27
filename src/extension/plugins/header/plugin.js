import { Editor, Element, Transforms, Node, Path } from 'slate';
import isHotkey from 'is-hotkey';
import { generateEmptyElement, getSelectedNodeEntryByTypes } from '../../core';
import { getHeaderType, isMenuDisabled, setHeaderType } from './helper';
import { MAC_HOTKEYS_EVENT_HEADER, WIN_HOTKEYS_EVENT_HEADER } from '../../constants/keyboard';
import { isMac } from '../../../utils/common';
import { HEADERS, LIST_TYPE_ARRAY, ELementTypes } from '../../constants';
import { TABLE } from '../../constants/element-types';

const isSelectionAtLineEnd = (editor, path) => {
  const { selection } = editor;

  if (!selection) return false;
  const isAtLineEnd = Editor.isEnd(editor, selection.anchor, path) || Editor.isEnd(editor, selection.focus, path);
  return isAtLineEnd;
};

const isSelectionAtLineStart = (editor, path) => {
  const { selection } = editor;

  if (!selection) return false;
  const isAtLineEnd = Editor.isStart(editor, selection.anchor, path) || Editor.isStart(editor, selection.focus, path);
  return isAtLineEnd;
};

const withHeader = (editor) => {
  const { insertBreak, insertFragment, insertText, deleteBackward, onHotKeyDown } = editor;
  const newEditor = editor;

  // Rewrite insertBreak - insert paragraph when carriage return at the end of header
  newEditor.insertBreak = () => {
    const [match] = Editor.nodes(newEditor, {
      match: n => {
        if (!Element.isElement(n)) return false;
        if (n.type.startsWith(ELementTypes.HEADER)) return true;
        return false;
      }, // Matches nodes whose node.type starts with header
      universal: true,
    });

    if (!match) {
      insertBreak();
      return;
    }

    const isAtLineEnd = isSelectionAtLineEnd(editor, match[1]);
    // If an empty p is inserted at the end of the line, otherwise wrap normally
    if (isAtLineEnd) {
      const p = generateEmptyElement(ELementTypes.PARAGRAPH);
      Transforms.insertNodes(newEditor, p, { mode: 'highest' });
    } else {
      insertBreak();
    }
  };

  newEditor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (!selection) return deleteBackward(unit);
    const [headerEntry] = Editor.nodes(newEditor, {
      match: n => {
        if (!Element.isElement(n)) return false;
        if (n.type && n.type.startsWith(ELementTypes.HEADER)) return true;
        return false;
      }, // Matches nodes whose node.type starts with header
      universal: true,
    });

    if (!headerEntry) {
      deleteBackward(unit);
      return false;
    }

    const isAtLineStart = isSelectionAtLineStart(editor, headerEntry[1]);
    if (isAtLineStart) {
      setHeaderType(editor, ELementTypes.PARAGRAPH);
      return true;
    }

    return deleteBackward(unit);
  };

  newEditor.insertFragment = (fragment) => {
    const headerEntry = getSelectedNodeEntryByTypes(editor, HEADERS);
    if (!headerEntry) return insertFragment(fragment);

    const firstChild = fragment[0];
    if (fragment.length === 1) {
      // is single list item
      if (LIST_TYPE_ARRAY.includes(firstChild.type)) {
        if (firstChild.children.length === 1) {
          const text = Node.string(fragment[0]);
          insertText(text);
          return;
        }
        const nextPath = Path.next(headerEntry[1]);
        Transforms.insertNodes(newEditor, fragment, { at: nextPath });
        return;
      }

      if (firstChild.type === TABLE) {
        const nextPath = Path.next(headerEntry[1]);
        Transforms.insertNodes(newEditor, fragment, { at: nextPath });
        return;
      }
    }
    return insertFragment(fragment);
  };

  newEditor.onHotKeyDown = (event) => {
    const HOT_KEYS = isMac() ? MAC_HOTKEYS_EVENT_HEADER : WIN_HOTKEYS_EVENT_HEADER;
    const hotEntries = Object.entries(HOT_KEYS);
    let isHeaderEvent = false;
    let headerType = '';

    for (const element of hotEntries) {
      const [key, value] = element;
      isHeaderEvent = isHotkey(value, event);
      if (isHeaderEvent) {
        headerType = key;
        break;
      }
    }
    if (!isHeaderEvent) {
      return onHotKeyDown && onHotKeyDown(event);
    }

    event.preventDefault();
    if (isMenuDisabled(newEditor)) return true;
    const currentHeaderType = getHeaderType(editor);
    if (currentHeaderType === headerType) {
      setHeaderType(newEditor, ELementTypes.PARAGRAPH);
    } else {
      setHeaderType(newEditor, headerType);
    }
    return true;
  };

  return newEditor;
};

export default withHeader;
