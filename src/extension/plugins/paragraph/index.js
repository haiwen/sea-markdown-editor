import { PARAGRAPH } from '../../constants/element-types';
import withParagraph from './plugin';
import renderParagraph from './render-elem';

const ParagraphPlugin = {
  type: PARAGRAPH,
  nodeType: 'element',
  editorPlugin: withParagraph,
  renderElements: [renderParagraph]
};

export default ParagraphPlugin;
