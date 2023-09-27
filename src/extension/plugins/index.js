import BlockquotePlugin from './blockquote';
import ParagraphPlugin from './paragraph';
import TextPlugin from './text-style';
import HeaderPlugin from './header';
import ImagePlugin from './image';
import NodeIdPlugin from './node-id';

const Plugins = [
  BlockquotePlugin,
  ParagraphPlugin,
  TextPlugin,
  HeaderPlugin,
  ImagePlugin,

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

  // put at the end
  NodeIdPlugin,
};
