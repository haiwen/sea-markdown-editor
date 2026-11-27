import { Editor, Node, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ELementTypes } from '../../constants';
import { generateDefaultParagraph } from '../../core/utils';

const withFormula = (editor) => {
  const { isVoid, normalizeNode } = editor;
  const newEditor = editor;


  newEditor.isVoid = (element) => {
    const { type } = element;

    if (type === ELementTypes.FORMULA) return true;
    return isVoid(element);
  };

  newEditor.normalizeNode = ([node, path]) => {
    if (path.length === 0 && node.children.length > 0) {
      const [, lastPath] = Node.last(node, path);
      const formula = Editor.above(editor, {
        at: lastPath,
        match: element => element.type === ELementTypes.FORMULA && !editor.isInline(element),
        voids: true,
      });
      if (formula) {
        const insertParagraph = () => Transforms.insertNodes(editor, generateDefaultParagraph(), { at: [node.children.length] });
        if (editor.forceNormalize && HistoryEditor.isHistoryEditor(editor)) {
          HistoryEditor.withoutSaving(editor, insertParagraph);
        } else {
          insertParagraph();
        }
        return;
      }
    }
    normalizeNode([node, path]);
  };

  return newEditor;
};

export default withFormula;
