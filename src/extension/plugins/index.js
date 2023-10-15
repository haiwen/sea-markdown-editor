import BlockquotePlugin from './blockquote';
import ParagraphPlugin from './paragraph';
import TextPlugin from './text-style';
import HeaderPlugin from './header';
import ImagePlugin from './image';
import NodeIdPlugin from './node-id';
import LinkPlugin from './link';
import CodeBlockPlugin from './code-block';
import CheckListPlugin from './check-list';

const Plugins = [
  BlockquotePlugin,
  ParagraphPlugin,
  TextPlugin,
  HeaderPlugin,
  ImagePlugin,
  LinkPlugin,
  CodeBlockPlugin,
  CheckListPlugin,

  // put at the end
  NodeIdPlugin,
];

export default Plugins;
export {
  BlockquotePlugin,
  ParagraphPlugin,
  TextPlugin,
  HeaderPlugin,
  ImagePlugin,
  LinkPlugin,
  CodeBlockPlugin,
  CheckListPlugin,

  // put at the end
  NodeIdPlugin,
};
