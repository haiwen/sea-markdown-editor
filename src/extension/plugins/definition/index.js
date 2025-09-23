import { DEFINITION } from '../../constants/element-types';
import renderDefinition from './render-elem';

const DefinitionPlugin = {
  type: DEFINITION,
  nodeType: 'element',
  renderElements: [renderDefinition],
};

export default DefinitionPlugin;
