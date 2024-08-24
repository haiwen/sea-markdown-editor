import { Editor, Node, Transforms, Range, Path, Text } from 'slate';
import slugid from 'slugid';
import { getNodeType, getSelectedNodeByType } from '../../core/queries';
import { generateLinkNode, getLinkInfo, isLinkType } from './helper';
import { LINK } from '../../constants/element-types';
import { ELementTypes } from '../../constants';
import { INTERNAL_EVENTS } from '../../../constants/event-types';
import { isImage, isUrl } from '../../../utils/common';
import { focusEditor } from '../../core/transforms/focus-editor';
import { insertImage } from '../image/helper';
import isHotkey from 'is-hotkey';
import EventBus from '../../../utils/event-bus';
import { getSelectedElems } from '../../core/queries';

const withLink = (editor) => {
  const { isInline, insertBreak, deleteBackward, insertText, normalizeNode, insertData, onHotKeyDown } = editor;
  const newEditor = editor;

  // Rewrite isInline
  newEditor.isInline = elem => {
    const { type } = elem;
    if (type === LINK) {
      return true;
    }
    return isInline(elem);
  };

  newEditor.insertBreak = () => {
    const [selectedElement, path] = Editor.parent(editor, editor.selection);
    if (selectedElement.type === LINK) {
      const endPoint = Range.end(editor.selection);
      const [selectedLeaf] = Editor.node(editor, endPoint);
      if (selectedLeaf.text.length === endPoint.offset) {
        if (Range.isExpanded(editor.selection)) {
          Transforms.delete(editor);
        } else {
          Transforms.select(editor, { path: Path.next(path), offset: 0 });
        }
      }
    }
    insertBreak();
  };

  // ! bug: insertFragment will insert the same character twice in LinkNode, so we need to delete the first character
  newEditor.insertText = (text) => {
    const isCollapsed = Range.isCollapsed(editor.selection);
    const path = Editor.path(editor, editor.selection);
    const isLinkNode = getSelectedNodeByType(editor, LINK);
    const isFocusAtLinkEnd = Editor.isEnd(editor, editor.selection.focus, path);
    if (isCollapsed && isLinkNode && isFocusAtLinkEnd) {
      Editor.insertFragment(newEditor, [{ id: slugid.nice(), text: text }]);
      return;
    }
    return insertText(text);
  };

  newEditor.insertData = (data) => {
    // Paste link content
    const text = data.getData('text/plain');
    if (isUrl(text) && !isImage(text)) {
      const link = generateLinkNode(text, text);
      Editor.insertFragment(newEditor, [link], { select: true });
      return;
    } else if (isUrl(text) && isImage(text)) {
      insertImage(newEditor, text);
      return;
    }
    insertData(data);
  };

  newEditor.deleteBackward = (unit) => {
    const { selection } = newEditor;
    if (!selection) return deleteBackward(unit);
    // Delete link node
    const isDeletingLinkNode = isLinkType(editor);
    if (isDeletingLinkNode) {
      const linkNodeInfo = getLinkInfo(editor);
      if (linkNodeInfo && linkNodeInfo.linkTitle.length === 1) {
        const next = Editor.next(editor);
        const nextPath = Path.next(linkNodeInfo.path);
        const nextNode = Editor.node(editor, nextPath);
        focusEditor(editor, next[1]);
        Transforms.select(editor, nextNode[1]);
        Transforms.delete(newEditor, { at: linkNodeInfo.path });
        return;
      }
    }
    return deleteBackward(unit);
  };

  // Add 'mod+k' shortcut Key
  newEditor.onHotKeyDown = (e) => {
    if (isHotkey('mod+k', e)) {
      e.preventDefault();
      const { selection } = newEditor;
      const isCollapsed = Range.isCollapsed(selection);
      const eventBus = EventBus.getInstance();
      if (isCollapsed){
        eventBus.dispatch(INTERNAL_EVENTS.INSERT_ELEMENT, { type: ELementTypes.LINK, editor });
      } else {
        const [firstSelectedNode, ...restNodes] = getSelectedElems(newEditor);
        if (!firstSelectedNode || restNodes.length) return; // If select more than one node or not select any node, return
        const isSelectTextNodes = firstSelectedNode.children.some(node => Text.isText(node));
        if (!isSelectTextNodes) return;
        const linkTitle = window.getSelection().toString();
        eventBus.dispatch(INTERNAL_EVENTS.INSERT_ELEMENT, { type: ELementTypes.LINK, editor: newEditor, linkTitle: linkTitle });
      }
    }
    return onHotKeyDown && onHotKeyDown(e);
  };

  // Rewrite normalizeNode
  newEditor.normalizeNode = ([node, path]) => {
    const type = getNodeType(node);
    if (type !== LINK) {
      // If the type is not link, perform default normalizeNode
      return normalizeNode([node, path]);
    }

    // If the link is empty, delete it
    const str = Node.string(node);
    if (str === '') {
      return Transforms.removeNodes(newEditor, { at: path });
    }
    return normalizeNode([node, path]);
  };

  return newEditor;
};

export default withLink;
