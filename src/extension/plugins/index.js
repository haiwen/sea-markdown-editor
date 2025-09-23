import BlockquotePlugin from './blockquote';
import ParagraphPlugin from './paragraph';
import TextPlugin from './text-style';
import HeaderPlugin from './header';
import ImagePlugin from './image';
import NodeIdPlugin from './node-id';
import LinkPlugin from './link';
import CodeBlockPlugin from './code-block';
import CheckListPlugin from './check-list';
import ListPlugin from './list';
import TablePlugin from './table';
import FormulaPlugin from './formula';
import ColumnPlugin from './column';
import MarkDownPlugin from './markdown';
import HtmlPlugin from './html';
import LinkReferencePlugin from './link-reference';
import DefinitionPlugin from './definition';

const Plugins = [
  ParagraphPlugin,
  TextPlugin,
  HeaderPlugin,
  ImagePlugin,
  CheckListPlugin,
  ListPlugin,
  CodeBlockPlugin,
  TablePlugin,
  BlockquotePlugin,
  LinkPlugin,
  FormulaPlugin,
  MarkDownPlugin,
  HtmlPlugin,

  ColumnPlugin,
  // put at the end
  NodeIdPlugin,
  LinkReferencePlugin,
  DefinitionPlugin,
];

export default Plugins;
export {
  ParagraphPlugin,
  TextPlugin,
  HeaderPlugin,
  ImagePlugin,
  LinkPlugin,
  CodeBlockPlugin,
  CheckListPlugin,
  ListPlugin,
  TablePlugin,
  BlockquotePlugin,
  FormulaPlugin,
  MarkDownPlugin,
  HtmlPlugin,

  ColumnPlugin,
  // put at the end
  NodeIdPlugin,
  LinkReferencePlugin,
  DefinitionPlugin,
};
