import React from 'react';
import { useSlateStatic } from 'slate-react';
import * as ElementType from '../constants/element-types';
import { BlockquotePlugin, HeaderPlugin, ParagraphPlugin, ImagePlugin, LinkPlugin, CodeBlockPlugin } from '../plugins';

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
      return renderImage(props);
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
      const [,renderCodeLine] = CodeBlockPlugin.renderElements;
      return renderCodeLine(props, editor);
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
