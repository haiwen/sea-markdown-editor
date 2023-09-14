import * as ElementType from '../constants/element-types';
import { BlockquotePlugin, ParagraphPlugin } from '../plugins';
import renderParagraph from '../plugins/paragraph/render-elem';

const SlateElement = (props) => {
  const { element } = props;
  switch(element.type) {
    case ElementType.BLOCKQUOTE: {
      const [renderBlockquote] = BlockquotePlugin.renderElements;
      return renderBlockquote(props);
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
