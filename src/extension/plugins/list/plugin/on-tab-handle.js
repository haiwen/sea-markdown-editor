import { Editor, Range, Transforms } from 'slate';
import isHotkey from 'is-hotkey';
import { findNode } from '../../../core';
import { LIST_ITEM } from '../../../constants/element-types';
import { moveListItems } from '../transforms';

export const handleTab = (editor, event) => {
  const { selection, hasMovedSelection } = editor;
  if (!selection) return;
  if (hasMovedSelection) event.stopPropagation();
  const selectedList = findNode(editor, { type: [LIST_ITEM] });
  if (!selectedList) return;
  let workRange = editor.selection;
  if (!Range.isCollapsed(selection)) {
    let { anchor, focus } = selection;
    if (Range.isBackward(selection)) {
      ({ anchor, focus } = { anchor: { ...selection.focus }, focus: { ...selection.anchor } });
    }
    const unHungRange = Editor.unhangRange(editor, { anchor, focus });
    if (unHungRange) {
      workRange = unHungRange;
      Transforms.select(editor, unHungRange);
    }
  }
  const isIncrease = isHotkey('shift+tab', event) ? false : true;
  if (workRange && selectedList) {
    event.preventDefault();
    moveListItems(editor, {
      at: workRange,
      increase: isIncrease,
      enableResetOnShiftTab: true,
    });
    return true;
  }
};
