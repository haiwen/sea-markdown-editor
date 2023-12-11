import { Editor, Node, Element } from 'slate';
import { useSlate } from 'slate-react';
import { CODE_BLOCK } from '../constants/element-types';
import Prism from './prismjs';
import { normalizeTokens } from './normalize-tokens';
import { LANGUAGE_MAP } from '../plugins/code-block/render-elem/constant';

const mergeMaps = (...maps) => {
  const map = new Map();

  for (const m of maps) {
    for (const item of m) {
      map.set(...item);
    }
  }

  return map;
};

const getChildNodeToDecorations = ([block, blockPath]) => {
  const nodeToDecorations = new Map();

  const text = block.children.map(line => Node.string(line)).join('\n');
  const language = LANGUAGE_MAP[block.lang] ? block.lang : 'text';

  const tokens = Prism.tokenize(text, Prism.languages[language]);
  const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line
  const blockChildren = block.children;

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index];
    const element = blockChildren[index];
    if (element) {
      if (!nodeToDecorations.has(element)) {
        nodeToDecorations.set(element, []);
      }
    }

    let start = 0;
    for (const token of tokens) {

      const length = token.content.length;
      if (!length) {
        continue;
      }

      const end = start + length;

      const path = [...blockPath, index, 0];
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map(type => [type, true])),
      };

      if (nodeToDecorations.get(element)) {
        nodeToDecorations.get(element).push(range);
      }

      start = end;
    }
  }

  return nodeToDecorations;
};

const SetNodeToDecorations = () => {
  const editor = useSlate();

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: 'highest',
      match: n => Element.isElement(n) && n.type === CODE_BLOCK,
    })
  );

  const nodeToDecorations = mergeMaps(
    ...blockEntries.map(getChildNodeToDecorations)
  );

  editor.nodeToDecorations = nodeToDecorations;

  return null;
};

export default SetNodeToDecorations;
