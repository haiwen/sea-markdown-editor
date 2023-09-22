import React, { useCallback } from 'react';
import { useSlateStatic } from 'slate-react';
import * as ElementType from '../constants/element-types';
import { BlockquotePlugin, HeaderPlugin, ParagraphPlugin } from '../plugins';
import EventBus from '../../utils/event-bus';
import { INTERNAL_EVENT } from '../constants/index';

const SlateElement = (props) => {
  const { element, attributes } = props;

  const editor = useSlateStatic();

  const onMouseEnter = useCallback((event) => {
    event.stopPropagation();
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENT.ON_MOUSE_ENTER_BLOCK, event);
  }, []);

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
      attributes['onMouseEnter'] = onMouseEnter;
      const [renderHeader] = HeaderPlugin.renderElements;
      return renderHeader(props, editor);
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
