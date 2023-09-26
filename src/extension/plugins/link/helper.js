import { Editor } from 'slate'
import { getNodeType } from '../../core/queries';
import { LINK } from '../../constants/element-types';

export const isDisabled = (editor: Editor,readonly) => {
  if(readonly) return true;
  return false;
}

export const isActive = (editor:Editor) => {
  return false;
}

export const isLinkType = (node) => {
  return getNodeType(node) === LINK;
}