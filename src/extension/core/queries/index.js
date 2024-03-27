import { Editor, Text, Path, Span, Element, Node, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { match } from '../utils';

// options
export const getQueryOptions = (editor, options) => {
  const { match: _match, block } = options;
  let newMatch = undefined;
  if (_match || block) {
    newMatch = (n, path) => match(n, path, _match) && (!block || Editor.isBlock(editor, n));
  }
  return {
    ...options,
    match: newMatch,
  };
};

export const findPath = (editor, node, defaultPath) => {
  try {
    return ReactEditor.findPath(editor, node);
  } catch {
    return defaultPath;
  }
};

// get node
export const getNode = (editor, path) => {
  let node = null;
  try {
    node = Node.get(editor, path);
  } catch (err) {
    node = null;
  }
  return node;
};

export const getNodeType = (node) => {
  return Element.isElement(node) ? node.type : '';
};

export const getParentNode = (nodes, nodeId) => {
  let parentNode;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const { children: childrenNodes } = node;
    if (!Array.isArray(childrenNodes)) continue;
    if (childrenNodes.find(node => node.id === nodeId)) {
      parentNode = node;
    } else {
      parentNode = getParentNode(childrenNodes, nodeId);
    }
    if (!parentNode) continue;
    break;
  }
  return parentNode;
};

export const getNodes = (node, options) => {
  return Node.nodes(node, options);
};

export const getCommonNode = (root, path, ancestor) => {
  return Node.common(root, path, ancestor);
};

export const getSelectedNodeByType = (editor, type) => {
  const match = (n) => getNodeType(n) === type;
  const [nodeEntry] = Editor.nodes(editor, { match, universal: true });

  return nodeEntry ? nodeEntry[0] : null;
};

export const getSelectedNodeByTypes = (editor, types) => {
  const match = (n) => types.includes(getNodeType(n));
  const [nodeEntry] = Editor.nodes(editor, { match, universal: true });
  return nodeEntry ? nodeEntry[0] : null;
};

export const getSelectedNodeEntryByType = (editor, type) => {
  const match = (n) => getNodeType(n) === type;
  const [nodeEntry] = Editor.nodes(editor, { match, universal: false });

  return nodeEntry ? nodeEntry : null;
};

export const getSelectedNodeEntryByTypes = (editor, types) => {
  const match = (n) => types.includes(getNodeType(n));
  const [nodeEntry] = Editor.nodes(editor, { match, universal: false });

  return nodeEntry ? nodeEntry : null;
};

export const getNodeEntries = (editor, options) => {
  return Editor.nodes(editor, getQueryOptions(editor, options));
};

export const getEditorString = (editor, at, options) => {
  if (!at) return '';

  try {
    return Editor.string(editor, at, options);
  } catch (error) {
    return '';
  }
};

// children & child
export const getChildren = (nodeEntry) => {
  const [node, path] = nodeEntry;

  if (Element.isAncestor(node)) {
    const { children } = node;
    return children.map((child, index) => {
      const childPath = path.concat([index]);
      return [child, childPath];
    });
  }
  return [];
};

export const getLastChild = (nodeEntry) => {
  const [node, path] = nodeEntry;
  if (Text.isText(node)) return null;
  if (!node.children.length) return null;
  const children = node.children;

  return [children[children.length - 1], path.concat([children.length - 1])];
};

export const getDeepInlineChildren = (editor, { children }) => {
  const inlineChildren = [];
  for (let child of children) {
    if (Editor.isBlock(editor, child[0])) {
      inlineChildren.push(...getDeepInlineChildren(editor, { children: getChildren(child) }));
    } else {
      inlineChildren.push(child);
    }
  }
  return inlineChildren;
};

export const getLastChildPath = (nodeEntry) => {
  const lastChild = getLastChild(nodeEntry);
  if (!lastChild) return nodeEntry[1].concat([-1]);

  return lastChild[1];
};

export const getPreviousPath = (path) => {
  if (path.length === 0) return;

  const last = path[path.length - 1];
  if (last <= 0) return;

  return path.slice(0, -1).concat(last - 1);
};

export const isFirstChild = (nodeEntry, childPath) => {
  const children = getChildren(nodeEntry);
  const firstChild = children[0] || [];
  const firstChildPath = firstChild[1];
  return Path.equals(firstChildPath, childPath);
};

export const isLastChild = (nodeEntry, childPath) => {
  const lastChildPath = getLastChildPath(nodeEntry);
  return Path.equals(lastChildPath, childPath);
};

export const getSelectedElems = (editor) => {
  const elems = [];
  const nodeEntries = Editor.nodes(editor, { universal: true });
  for (let nodeEntry of nodeEntries) {
    const [node] = nodeEntry;
    if (Element.isElement(node)) elems.push(node);
  }
  return elems;
};

// siblings
export const getNextSiblingNodes = (ancestorEntry, path) => {
  const [ancestor, ancestorPath] = ancestorEntry;

  const leafIndex = path[ancestorPath.length];

  const siblings = [];
  const ancestorChildren = ancestor.children;

  if (leafIndex + 1 < ancestor.children.length) {
    for (let i = leafIndex + 1; i < ancestor.children.length; i++) {
      siblings.push(ancestorChildren[i]);
    }
  }

  return siblings;
};

// parent
export const getAboveNode = (editor, options) => {
  return Editor.above(editor, getQueryOptions(editor, options));
};

export const getAboveBlockNode = (editor, options) => {
  return getAboveNode(editor, { ...options, block: true });
};

export const getPrevNode = (editor) => {
  const [lowerNode, lowerPath] = getAboveNode(editor, {
    mode: 'lowest',
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
  });

  const [heightNode, heightPath] = getAboveNode(editor, {
    mode: 'highest',
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
  });

  let prevNode = null;
  try {
    prevNode = Editor.previous(editor, {
      at: lowerPath,
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
    });
  } catch (error) {
    prevNode = null;
  }

  if (lowerNode.id !== heightNode.id && !prevNode) {
    try {
      prevNode = Editor.previous(editor, {
        at: heightPath,
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      });
    } catch (error) {
      prevNode = null;
    }
  }
  return prevNode;
};

export const getNextNode = (editor) => {
  const [lowerNode, lowerPath] = getAboveNode(editor, {
    mode: 'lowest',
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
  });

  const [heightNode, heightPath] = getAboveNode(editor, {
    mode: 'highest',
    match: n => Element.isElement(n) && Editor.isBlock(editor, n),
  });

  let nextNode = null;
  try {
    nextNode = Editor.next(editor, {
      at: lowerPath,
      match: n => Element.isElement(n) && Editor.isBlock(editor, n),
    });
  } catch (error) {
    nextNode = null;
  }

  if (lowerNode.id !== heightNode.id && !nextNode) {
    try {
      nextNode = Editor.next(editor, {
        at: heightPath,
        match: n => Element.isElement(n) && Editor.isBlock(editor, n),
      });
    } catch (error) {
      nextNode = null;
    }
  }
  return nextNode;
};

// find node
export const findNode = (editor, options) => {
  const nodeEntries = Editor.nodes(editor, {
    at: editor.selection || [],
    ...getQueryOptions(editor, options)
  });

  const _nodeEntries = Array.from(nodeEntries);
  if (_nodeEntries[0]) {
    return _nodeEntries[0];
  }

  return undefined;
};

export const findDescendant = (editor, options) => {
  const { at = editor.selection, reverse = false, voids = false, match: _match } = options;
  if (!at) return;

  let from;
  let to;
  if (Span.isSpan(at)) {
    [from, to] = at;
  } else if (Range.isRange(at)) {
    const first = Editor.first(editor, at);
    const last = Editor.last(editor, at);
    from = reverse ? last : first;
    to = reverse ? first : last;
  }

  let root = [editor, []];
  if (Path.isPath(at)) {
    root = Editor.node(editor, at);
  }

  const nodeEntries = Node.descendants(root[0], {
    from,
    to,
    reverse,
    pass: ([n]) => (voids ? false : Editor.isVoid(editor, n))
  });

  for (const [node, path] of nodeEntries) {
    if (match(node, path, _match)) {
      return [node, at.concat(path)];
    }
  }

  return undefined;
};

// is
export const isStartPoint = (editor, point, at) => {
  return !!point && Editor.isStart(editor, point, at);
};

export const isEndPoint = (editor, point, at) => {
  return !!point && Editor.isEnd(editor, point, at);
};

export const isBlockTextEmptyAfterSelection = (editor) => {
  if (!editor.selection) return false;

  const blockAbove = Editor.above(editor, { block: true });
  if (!blockAbove) return false;

  const cursor = editor.selection.focus;

  const selectionParentEntry = Editor.parent(editor, editor.selection);
  if (!selectionParentEntry) return false;
  const [, selectionParentPath] = selectionParentEntry;

  if (!isEndPoint(editor, cursor, selectionParentPath)) return false;

  const siblingNodes = getNextSiblingNodes(blockAbove, cursor.path);

  if (siblingNodes.length) {
    // 子节点包含 文本节点
    for (const siblingNode of siblingNodes) {
      if (Text.isText(siblingNode) && siblingNode.text) {
        return false;
      }
    }
  } else {
    return isEndPoint(editor, cursor, blockAbove[1]);
  }

  return true;
};

export const isRangeAcrossBlocks = (editor, { at, ...options } = {}) => {
  if (!at) at = editor.selection;
  if (!at) return;

  const [start, end] = Range.edges(at);
  const startBlock = getAboveBlockNode(editor, {
    at: start,
    ...options,
  });
  const endBlock = getAboveBlockNode(editor, {
    at: end,
    ...options,
  });

  if (!startBlock && !endBlock) return;

  if (!startBlock || !endBlock) return true;

  return !Path.equals(startBlock[1], endBlock[1]);
};

export const isAncestorEmpty = (editor, node) => {
  return !Node.string(node) && !node.children.some((n) => Editor.isInline(editor, n));
};

export const isBlockAboveEmpty = (editor) => {
  const block = getAboveBlockNode(editor)?.[0];
  if (!block) return false;
  return isAncestorEmpty(editor, block);
};

export const isSelectionAtBlockStart = (editor, options) => {
  const { selection } = editor;
  if (!selection) return false;

  const path = getAboveBlockNode(editor, options)?.[1];
  if (!path) return false;

  return (
    isStartPoint(editor, selection.focus, path) ||
    (Range.isExpanded(editor.selection) && isStartPoint(editor, selection.anchor, path))
  );
};

export const isSelectionAtBlockEnd = (editor, options) => {
  const path = getAboveBlockNode(editor, options)?.[1];

  return !!path && isEndPoint(editor, editor.selection?.focus, path);
};

export const isFirstNode = (editor, node) => {
  const editorChildren = editor.children || [];
  return editorChildren[0] === node;
};

export const isLastNode = (editor, node) => {
  const editorChildren = editor.children || [];
  const editorChildrenLength = editorChildren.length;
  return editorChildren[editorChildrenLength - 1] === node;
};

export const isTextNode = (node) => {
  if (!node) return false;
  if (Reflect.has(node, 'children')) return false;
};
