import { Editor, Path, Range, Transforms } from 'slate';
import slugid from 'slugid';
import { findPath, getAboveNode, getEditorString, getNodeType, getSelectedElems } from '../../core/queries';
import { focusEditor } from '../../core/transforms/focus-editor';
import { ELementTypes, INSERT_POSITION } from '../../constants';
import { generateDefaultText, generateEmptyElement } from '../../core/utils';
import { replaceNodeChildren } from '../../core/transforms/replace-node-children';

export const isMenuDisabled = (editor, readonly = false) => {
  if (readonly) return true;
  const { selection } = editor;
  if (!selection) return false;
  const selectedElems = getSelectedElems(editor);
  // Check if the selected element is illegal
  const isSelectedIllegalElement = selectedElems.some(elem => {
    const { type } = elem;
    if (editor.isVoid(elem)) return true;
    if ([ELementTypes.CODE_BLOCK, ELementTypes.CODE_LINE].includes(type)) return true;
    return false;
  });
  if (isSelectedIllegalElement) return true;
  return false;
};

export const isLinkType = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => getNodeType(n) === ELementTypes.LINK,
    universal: true,
  });
  return !!match;
};

export const generateLinkNode = (url, title) => {
  const linkNode = {
    type: ELementTypes.LINK,
    url: url,
    title: title,
    id: slugid.nice(),
    children: [{ id: slugid.nice(), text: title || '' }],
  };
  return linkNode;
};

/**
 * @param {Object} props
 * @param {Object} props.editor
 * @param {String} props.url
 * @param {String} props.title
 * @param {InsertPosition} props.insertPosition
 * @param {Object | undefined} props.slateNode
 */
export const insertLink = (props) => {
  const { editor, url, title, insertPosition = INSERT_POSITION.CURRENT, slateNode } = props;
  const { selection } = editor;
  if (insertPosition === INSERT_POSITION.CURRENT && isMenuDisabled(editor)) return;
  // We had validated in modal,here we do it again for safety
  if (!title || !url) return;
  if (!selection) return;

  const linkNode = generateLinkNode(url, title);

  if (insertPosition === INSERT_POSITION.AFTER) {
    let path = Editor.path(editor, selection);

    if (slateNode && slateNode?.type === ELementTypes.LIST_ITEM) {
      path = findPath(editor, slateNode, []);
      const nextPath = Path.next(path);
      Editor.insertNodes(editor, linkNode, { at: nextPath });
      return;
    }

    const linkNodeWrapper = generateEmptyElement(ELementTypes.PARAGRAPH);
    // LinkNode should be wrapped by p and within text nodes in order to be editable
    linkNodeWrapper.children.push(linkNode, generateDefaultText());
    Transforms.insertNodes(editor, linkNodeWrapper, { at: [path[0] + 1] });
    focusEditor(editor);
    return;
  }

  const isCollapsed = Range.isCollapsed(selection);
  if (isCollapsed) {
    // If selection is collapsed, we insert a space and then insert link node that help operation easier
    editor.insertText('');
    Editor.insertFragment(editor, [linkNode]);
    // Using insertText directly causes the added Spaces to be added to the linked text, as in the issue above, so replaced by insertFragment
    Editor.insertFragment(editor, [{ id: slugid.nice(), text: '' }]);

    focusEditor(editor);
    return;
  } else {
    const selectedText = Editor.string(editor, selection); // Selected text
    if (selectedText !== title) {
      // Replace the selected text with the link node if the selected text is different from the entered text
      editor.deleteFragment();
      Transforms.insertNodes(editor, linkNode);
    } else {
      // Wrap the selected text with the link node if the selected text is the same as the entered text
      Transforms.wrapNodes(editor, linkNode, { split: true, at: selection });
      Transforms.collapse(editor, { edge: 'end' });
    }
  }
  focusEditor(editor);
};

export const getLinkInfo = (editor) => {
  const isLinkNode = isLinkType(editor);
  if (!isLinkNode) return null;
  const [match] = Editor.nodes(editor, {
    match: n => getNodeType(n) === ELementTypes.LINK,
    universal: true,
  });
  if (!match) return null;
  const [node, path] = match;
  const showedText = getEditorString(editor, path);
  return {
    linkUrl: node.url,
    linkTitle: showedText || node.title,
    path: path,
  };
};

export const updateLink = (editor, newUrl, newText) => {
  const linkAbove = getAboveNode(editor, { match: { type: ELementTypes.LINK } });
  if (!linkAbove) return;
  const { href: oldUrl, title: oldText } = linkAbove[0] || {};
  if (oldUrl !== newUrl || oldText !== newText) {
    Transforms.setNodes(editor, { url: newUrl, title: newText }, { at: linkAbove[1] });
  }
  upsertLinkText(editor, { text: newText });
};

export const upsertLinkText = (editor, { text }) => {
  const newLink = getAboveNode(editor, { match: { type: ELementTypes.LINK } });
  if (!newLink) return;
  const [newLInkNode, newLinkPath] = newLink;
  if ((text && text.length) && text !== getEditorString(editor, newLinkPath)) {
    const firstText = newLInkNode.children[0];
    replaceNodeChildren(editor, {
      at: newLinkPath,
      nodes: { ...firstText, text },
      insertOptions: {
        select: true
      }
    });
  }
};

export const unWrapLinkNode = async (editor) => {
  if (editor.selection == null) return;

  const [linkNode] = Editor.nodes(editor, {
    match: n => getNodeType(n) === ELementTypes.LINK,
    universal: true,
  });
  // Check selection is link node
  if (!linkNode || !linkNode[0]) return;

  Transforms.unwrapNodes(editor, {
    match: n => getNodeType(n) === ELementTypes.LINK,
  });
};
