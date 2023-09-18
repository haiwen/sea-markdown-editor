import slugid from 'slugid';

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

export const generateEmptyElement = (type) => {
  return { id: slugid.nice(), type, children: [generateDefaultText()] };
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
  const { t } = useTranslation();
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
}