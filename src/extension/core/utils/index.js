import slugid from 'slugid';
import { useTranslation } from 'react-i18next';
import { HEADER1, PARAGRAPH } from '../../constants/element-types';
import { TRANSLATE_NAMESPACE } from '../../../constants';

export const match = (node, path, predicate) => {
  if (!predicate) return true;
  if (typeof predicate === 'object') {
    return Object.entries(predicate).every(([key, value]) => {
      if (value && !Array.isArray(value)) {
        return node[key] === value;
      }

      value = value ? value : [];
      return value.includes(node[key]);
    });
  }

  return predicate(node, path);
};

export const generateDefaultText = () => {
  return { id: slugid.nice(), text: '' };
};

export const generateDefaultParagraph = () => {
  return { id: slugid.nice(), type: PARAGRAPH, children: [generateDefaultText()] };
};

export const generateEmptyElement = (type) => {
  return { id: slugid.nice(), type, children: [generateDefaultText()] };
};

export const generateHeaderElement = (text) => {
  const headerText = { id: slugid.nice(), text: text };
  return { id: slugid.nice(), type: HEADER1, children: [headerText] };
};

/**
 * @param {String} type
 * @param {Object} options
 * @param {Node[] | String} [options.childrenOrText = ''] If provide a string,that will generate a text node as children automatically
 * @param {object} [options.props = {}]
 * @returns {Node}
 */
export const generateElement = (type, options = {}) => {
  let { childrenOrText = '', props = {} } = options;
  if (typeof childrenOrText === 'string') {
    childrenOrText = [{ id: slugid.nice(), text: childrenOrText }];
  }
  if (!Array.isArray(childrenOrText)) {
    throw Error('childrenOrText must be a string or a Node array!');
  }
  return { id: slugid.nice(), type, children: childrenOrText, ...props };
};

export const isEmptyParagraph = (node) => {
  if (node.type !== 'paragraph') return false;
  if (node.children.length !== 1) return false;
  const [child] = node.children;
  if (Text.isText(child) && child.text === '' && child.type !== 'image') return true;
  return false;
};

export const Placeholder = (props) => {
  const { title } = props;
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  return (
    <span style={{
      position: 'absolute',
      top: '0px',
      color: 'rgba(191,191,191,1)',
      pointerEvents: 'none',
      width: '100%',
      maxWidth: '100%',
      display: 'block',
      userSelect: 'none',
      textDecoration: 'none'
    }}>{t(title)}</span>
  );
};
