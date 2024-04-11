export const genCodeLangs = () => {

  return [
    { text: 'Plain Text', value: 'plaintext' },
    { text: 'Bash', value: 'bash' },
    { text: 'CSS', value: 'css' },
    { text: 'C', value: 'c' },
    { text: 'C++', value: 'cpp' },
    { text: 'C#', value: 'csharp' },
    { text: 'Go', value: 'go' },
    { text: 'HTML', value: 'html' },
    { text: 'Javascript', value: 'javascript' },
    { text: 'Java', value: 'java' },
    { text: 'PHP', value: 'php' },
    { text: 'Python', value: 'python' },
    { text: 'Ruby', value: 'ruby' },
    { text: 'SQL', value: 'sql' },
    { text: 'Swift', value: 'swift' },
    { text: 'Typescript', value: 'typescript' },
    { text: 'XML', value: 'xml' },
  ];
};

export const formatInlineNodes = (inlineNodes) => {
  if (!inlineNodes || !Array.isArray(inlineNodes) || inlineNodes.length === 0) return [];
  const isAllTextNode = inlineNodes.every(inlineNode => {
    const keys = Object.keys(inlineNode);
    return keys.length === 2; // keys length is 2: node is text
  });

  if (!isAllTextNode) return inlineNodes;

  // if elements is all text node, combine the elements
  const newInlineNodes = [{
    id: inlineNodes[0].id,
    text: inlineNodes.reduce((ret, item) => ret + item.text, ''),
  }];

  return newInlineNodes;
};
