import { Node, Path, Range, Transforms } from 'slate';
import { getNodeEntries, getSelectedNodeByType } from '../../core';
import { CHECK_LIST_ITEM, TABLE } from '../../constants/element-types';
import { transformToParagraph } from '../paragraph/helper';

const withCheckList = (editor) => {
  const { insertBreak, deleteBackward, insertFragment } = editor;
  const newEditor = editor;

  newEditor.insertBreak = () => {
    if (!newEditor.selection) {
      insertBreak();
      return;
    }
    const checkListNode = getSelectedNodeByType(newEditor, CHECK_LIST_ITEM);
    if (!checkListNode) {
      insertBreak();
      return;
    }
    const nodeText = Node.string(checkListNode);
    if (nodeText.length === 0) {
      transformToParagraph(newEditor);
    } else {
      Transforms.splitNodes(newEditor, { always: true });
    }
  };

  newEditor.deleteBackward = (unit) => {
    const { selection } = newEditor;
    if (selection && Range.isCollapsed(selection)) {
      const selectedCheckListNode = getSelectedNodeByType(newEditor, CHECK_LIST_ITEM);
      if (selectedCheckListNode) {
        const checkListNodeText = Node.string(selectedCheckListNode);
        if (!checkListNodeText.length) {
          transformToParagraph(newEditor);
          return;
        }
      }
    }
    deleteBackward(unit);
  };

  newEditor.insertFragment = (fragment) => {
    const match = { type: [CHECK_LIST_ITEM] };
    const [checkListEntry] = getNodeEntries(newEditor, { match });
    if (!checkListEntry) return insertFragment(fragment);

    const firstChild = fragment[0];
    if (fragment.length === 1 && firstChild.type === TABLE) {
      const nextPath = Path.next(checkListEntry[1]);
      Transforms.insertNodes(newEditor, fragment, { at: nextPath });
      return;
    }
    return insertFragment(fragment);
  };

  return newEditor;
};

export default withCheckList;
