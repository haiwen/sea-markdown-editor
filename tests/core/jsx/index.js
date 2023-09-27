import { createHyperscript, createText as createTestText } from 'slate-hyperscript';
import { ELEMENTS } from '../constants';

export const jsx = createHyperscript({
  elements: ELEMENTS,
  creators: {
    htext: createTestText
  }
});
