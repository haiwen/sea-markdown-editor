import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import { ELementTypes } from '../../constants';
import { generateEmptyElement } from '../../core';

const HR_PATTERNS = ['---', '***', '___'];

const withDivider = (editor) => {
  const { isVoid, insertText } = editor;
  const newEditor = editor;

  newEditor.isVoid = (element) => {
    const { type } = element;

    if (type === ELementTypes.DIVIDER) return true;
    return isVoid(element);
  };

  newEditor.insertText = (text) => {
    const { selection } = newEditor;
    if (!selection && Range.isCollapsed(selection)) {
      insertText(text);
      return;
    }

    const [blockEntry] = Editor.nodes(newEditor, {
      at: selection,
      match: (n) => Element.isElement(n) && n.type === ELementTypes.PARAGRAPH,
    });

    if (!blockEntry) {
      insertText(text);
      return;
    }

    const [blockNode, blockPath] = blockEntry;
    const blockText = Node.string(blockNode);

    const nextText = blockText + text;

    if(HR_PATTERNS.includes(nextText)) {
      Editor.withoutNormalizing(newEditor, () => {
        Transforms.removeNodes(newEditor, { at: blockPath });
        Transforms.insertNodes(newEditor, generateEmptyElement(ELementTypes.DIVIDER), { at: blockPath });

        const nextPath = Path.next(blockPath);
        Transforms.insertNodes(newEditor, generateEmptyElement(ELementTypes.PARAGRAPH), { at: nextPath });
        Transforms.select(newEditor, Editor.start(newEditor, nextPath));
      });
      return;
    }

    return insertText(text);
  };

  return newEditor;
};

export default withDivider;
