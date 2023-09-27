import { Editor, Node, Range, Transforms } from 'slate';
import slugid from 'slugid';
import { generateDefaultText } from '../../core/utils';
import { getNodeType, getSelectedNodeByType } from '../../core/queries';
import { generateLinkNode } from './helper';
import { LINK } from '../../constants/element-types';
import { isImage, isUrl } from '../../../utils/common';

const withLink = (editor) => {
  const { normalizeNode, isInline, insertData, insertText } = editor;
  const newEditor = editor;

  // Rewrite isInline
  newEditor.isInline = elem => {
    const { type } = elem;
    if (type === 'link') return true;
    return isInline(elem);
  };

  newEditor.insertText = (text) => {
    const path = Editor.path(editor, editor.selection);
    if (Range.isCollapsed(editor.selection) && getSelectedNodeByType(editor, LINK) && Editor.isEnd(editor, editor.selection.focus, path)) {
      editor.insertFragment([generateDefaultText()]);
      return;
    }
    return insertText(text);
  };

  newEditor.insertData = (data) => {
    // Paste link content
    const text = data.getData('text/plain');
    if (isUrl(text) && !isImage(text)) {
      const link = generateLinkNode(text, text);
      Transforms.insertNodes(newEditor, [link, { id: slugid.nice(), text: ' ' }]);
      return;
    }
    insertData(data);
  };

  // Rewrite normalizeNode
  newEditor.normalizeNode = ([node, path]) => {
    const type = getNodeType(node);
    if (type !== 'link') {
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
