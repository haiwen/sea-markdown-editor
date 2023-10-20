import { PARAGRAPH } from '../../constants/element-types';
import renderParagraph from './render-elem';

const ParagraphPlugin = {
  type: PARAGRAPH,
  nodeType: 'element',
  renderElements: [renderParagraph]
};

export default ParagraphPlugin;
