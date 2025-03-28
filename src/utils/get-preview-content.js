import { Node } from 'slate';
import { mdStringToSlate } from '@seafile/seafile-editor';

const PREVIEW_TEXT_LENGTH = 150;

const getPreviewContent = (content, isMarkdown = true, previewTextNeedSlice = true) => {
  const slateNodes = isMarkdown ? mdStringToSlate(content) : content;
  let previewContent = {
    previewText: '',
    images: [],
    links: [],
    checklist: {
      total: 0,
      completed: 0
    }
  };
  getPreviewInfo(slateNodes, previewContent);
  getPreviewText(slateNodes, previewContent, previewTextNeedSlice);
  return previewContent;
};

const getPreviewInfo = (nodes, previewContent) => {
  let nodeIndex = 0;
  while (nodes && nodeIndex <= nodes.length - 1) {
    const currentNode = nodes[nodeIndex];
    if (currentNode.type === 'link') {
      previewContent.links.push(currentNode.url);
    } else if (currentNode.type === 'image') {
      previewContent.images.push(currentNode.data.src);
    } else if (currentNode.type === 'check_list_item') {
      previewContent.checklist.total += 1;
      if (currentNode.checked) {
        previewContent.checklist.completed++;
      }
      // recalculate child elements
      getPreviewInfo(currentNode.children, previewContent);
    } else {
      getPreviewInfo(currentNode.children, previewContent);
    }
    nodeIndex++;
  }
};

const getPreviewText = (content, previewContent, previewTextNeedSlice) => {
  let previewText = '';
  for (let index = 0; index < content.length; index++) {
    previewText += getTextOfNode(content[index]) + ' ';
    let textLength = previewText.length;
    if (previewTextNeedSlice && textLength >= PREVIEW_TEXT_LENGTH) {
      previewText = textLength > PREVIEW_TEXT_LENGTH ? previewText.slice(0, PREVIEW_TEXT_LENGTH) : previewText;
      break;
    }
  }
  previewContent.previewText = previewText;
};

const getTextOfNode = (node) => {
  let text = '';

  if (node.type === 'check_list_item') {
    text += '';
    return text;
  }

  for (let index = 0; index < node.children.length; index++) {
    const currentNode = node.children[index];
    const { type } = currentNode;
    if (type === 'link') {
      text += '';
    } else {
      text += Node.string(currentNode) + ' ';
    }
  }
  return text;
};

export default getPreviewContent;
