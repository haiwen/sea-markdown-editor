import deepCopy from 'deep-copy';
import slugid from 'slugid';
import * as OPERATION from './constants';
import ObjectUtils from '../../../utils/object-utils';

export const decorateOperation = (operation) => {
  let newOperation = deepCopy(operation);
  console.log(newOperation);
  const { type } = newOperation;
  switch(type) {
    case OPERATION.INSERT_NODE: {
      let { node } = newOperation;
      if (!node.id) node.id = slugid.nice();  // generate an id for insert node
      break;
    }
    case OPERATION.SPLIT_NODE: {
      // child: split [7, 0] -> [[7, 0],[7, 1]]
      // parent: split [[7, 0], [7, 1]] -> [[7], [8]]
      const { properties = {} } = newOperation;
      // need generate a new id for new node
      properties.id = slugid.nice();
      break;
    }
    default: {
      break;
    }
  }

  return newOperation;
};

export const replaceNodeId = (node) => {
  if (!ObjectUtils.isObject(node)) return node;
  if (ObjectUtils.hasProperty(node, 'children')) {
    return {
      ...node,
      id: slugid.nice(),
      children: replacePastedDataId(node.children),
    };
  }

  return {
    ...node,
    id: slugid.nice(),
  };
};

export const replacePastedDataId = (pastedData) => {
  // If children is malformed, return a list of correct child nodes
  if (ObjectUtils.isObject(pastedData)) {
    return replaceNodeId(pastedData);
  }

  if (!Array.isArray(pastedData)) return [{id: slugid.nice(), text: ''}];
  return pastedData.map(item => {
    item.id = slugid.nice();
    if (item.children) {
      item.children = replacePastedDataId(item.children);
    }
    return item;
  });
};
