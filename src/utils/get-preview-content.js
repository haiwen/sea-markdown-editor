import { Node } from 'slate';
import { mdStringToSlate } from '@seafile/seafile-editor';

const getPreviewContent = (content, isMarkdown = true) => {
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
  getPreviewText(slateNodes, previewContent);
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
    } else {
      getPreviewInfo(currentNode.children, previewContent);
    }
    nodeIndex++;
  }
};

const getPreviewText = (content, previewContent) => {
  let previewText = '';
  for (let index = 0; index < content.length; index++) {
    previewText += getTextOfNode(content[index]) + ' ';
    let textLength = previewText.length;
    if (textLength >= 150) {
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
