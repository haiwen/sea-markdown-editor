import React from 'react';
import { useSlateStatic } from 'slate-react';
import * as ElementType from '../constants/element-types';
import { BlockquotePlugin, HeaderPlugin, ParagraphPlugin, ImagePlugin, LinkPlugin, CodeBlockPlugin, CheckListPlugin, ListPlugin, TablePlugin } from '../plugins';

const SlateElement = (props) => {
  const { element } = props;

  const editor = useSlateStatic();

  switch (element.type) {
    case ElementType.BLOCKQUOTE: {
      const [renderBlockquote] = BlockquotePlugin.renderElements;
      return renderBlockquote(props);
    }
    case ElementType.HEADER1:
    case ElementType.HEADER2:
    case ElementType.HEADER3:
    case ElementType.HEADER4:
    case ElementType.HEADER5:
    case ElementType.HEADER6: {
      const [renderHeader] = HeaderPlugin.renderElements;
      return renderHeader(props, editor);
    }
    case ElementType.IMAGE: {
      const [renderImage] = ImagePlugin.renderElements;
      return renderImage(props, editor);
    }
    case ElementType.LINK: {
      const [renderLink] = LinkPlugin.renderElements;
      return renderLink(props, editor);
    }
    case ElementType.CODE_BLOCK: {
      const [renderCodeBlock] = CodeBlockPlugin.renderElements;
      return renderCodeBlock(props);
    }
    case ElementType.CODE_LINE: {
      const [, renderCodeLine] = CodeBlockPlugin.renderElements;
      return renderCodeLine(props, editor);
    }
    case ElementType.CHECK_LIST_ITEM: {
      const [renderCheckListItem] = CheckListPlugin.renderElements;
      return renderCheckListItem(props, editor);
    }
    case ElementType.ORDERED_LIST:
    case ElementType.UNORDERED_LIST: {
      const [renderList] = ListPlugin.renderElements;
      return renderList(props, editor);
    }
    case ElementType.LIST_ITEM: {
      const [, renderListItem] = ListPlugin.renderElements;
      return renderListItem(props, editor);
    }
    case ElementType.TABLE_CELL: {
      const [renderTableCell] = TablePlugin.renderElements;
      return renderTableCell(props);
    }
    case ElementType.TABLE_ROW: {
      const [, renderTableRow] = TablePlugin.renderElements;
      return renderTableRow(props);
    }
    case ElementType.TABLE: {
      const [, , renderTable] = TablePlugin.renderElements;
      return renderTable(props, editor);
    }
    default: {
      const [renderParagraph] = ParagraphPlugin.renderElements;
      return renderParagraph(props);
    }
  }

};

const renderElement = (props) => {
  return <SlateElement {...props} />;
};

export default renderElement;
