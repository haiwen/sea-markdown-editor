import { Editor, Node, Transforms, Range, Path } from 'slate';
import slugid from 'slugid';
import { getNodeType, getSelectedNodeByType } from '../../core/queries';
import { generateLinkNode, getLinkInfo, isLinkType } from './helper';
import { LINK } from '../../constants/element-types';
import { isImage, isUrl } from '../../../utils/common';
import { focusEditor } from '../../core/transforms/focus-editor';

const withLink = (editor) => {
  const { isInline, deleteBackward, insertText, normalizeNode, insertData } = editor;
  const newEditor = editor;

  // Rewrite isInline
  newEditor.isInline = elem => {
    const { type } = elem;
    if (type === LINK) {
      return true;
    }
    return isInline(elem);
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
      const next = Editor.next(editor);
      const nextPath = Path.next(linkNodeInfo.path);
      const nextNode = Editor.node(editor, nextPath);
      focusEditor(editor, next[1]);
      Transforms.select(editor, nextNode[1]);
      if (linkNodeInfo && linkNodeInfo.linkTitle.length === 1) {
        Transforms.delete(newEditor, { at: linkNodeInfo.path });
        return;
      }
    }
    return deleteBackward(unit);
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
