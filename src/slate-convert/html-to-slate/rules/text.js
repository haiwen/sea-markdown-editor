import slugid from 'slugid';

const TEXT_MARKS = {
  STRONG: 'bold',
  B: 'bold',
  I: 'italic',
  EM: 'italic',
  U: 'underline',
  CODE: 'code',
  DEL: 'delete',
  INS: 'add',
};

const applyTextMark = (node, mark) => {
  if (typeof node.text === 'string') return { ...node, [mark]: true };
  if (Array.isArray(node.children)) {
    return { ...node, children: node.children.map(child => applyTextMark(child, mark)) };
  }
  return node;
};

const textRule = (element, parseChild) => {
  const { nodeName, nodeType } = element;
  if (nodeType === 3) {
    return {
      id: slugid.nice(),
      text: element.textContent,
    };
  }

  if (nodeName === 'CODE' && element.parentElement.nodeName === 'PRE') return;

  let mark = TEXT_MARKS[nodeName];
  if (nodeName === 'SPAN' && /\bunderline\b/.test(element.style.textDecorationLine || element.style.textDecoration)) {
    mark = 'underline';
  }
  if (!mark && nodeName !== 'SPAN') return;

  const children = parseChild(element.childNodes);
  if (children.length === 0) {
    children.push({ id: slugid.nice(), text: '' });
  }
  return mark ? children.map(child => applyTextMark(child, mark)) : children;
};

export default textRule;
