import checkIsUrl from 'is-url';
import { Editor, Node, Text } from 'slate';

export const isMac = () => {
  const platform = navigator.platform;
  return (platform === 'Mac68K') || (platform === 'MacPPC') || (platform === 'Macintosh') || (platform === 'MacIntel');
};

export const IMAGE_TYPES = [
  'png',
  'jpg',
  'gif',
];

export const isImage = (url) => {
  if (!url) return false;

  if (!isUrl(url)) return false;

  const fileName = url.slice(url.lastIndexOf('/') + 1); // http://xx/mm/*.png
  const suffix = fileName.split('.')[1];
  if (!suffix) return false;

  return IMAGE_TYPES.includes(suffix.toLowerCase());
};

export const isUrl = (url) => {
  if (!url) return false;
  if (!url.startsWith('http')) return false;
  if (!checkIsUrl(url)) return false;
  return true;
};

// Check document is empty or only contains void nodes
export const isDocumentEmpty = (editor) => {
  const document = editor.children;
  const [firstChildNode] = document;
  // Check if document has only one block node
  const isWrapperEmpty = document.length === 1 && Node.string(firstChildNode).length === 0;
  if (!isWrapperEmpty) return false;
  // Check if the only one block node has only one text node with empty string
  const hasVoidNode = firstChildNode.children.some(node => Editor.isVoid(editor, node));
  if (hasVoidNode) return false;

  return true;
};
