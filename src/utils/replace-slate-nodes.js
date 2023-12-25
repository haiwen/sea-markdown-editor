// root -> paragraph ->
export const replaceColumnData = (mdNodes, columns, getCellValue, updateImgUrl) => {
  for (let i = 0; i < mdNodes.length; i++) {
    const node = mdNodes[i];
    if (node.type === 'column') {
      const data = node.data;
      const column = columns.find(column => column.key === data.key);
      const value = column ? (getCellValue && getCellValue(column)) : '';
      // change column node to text node
      const newNode = { 'text': value, 'bold': data.bold, 'italic': data.italic };
      mdNodes.splice(i, 1, newNode);
      continue;
    }
    // replace image node's src
    if (node.type === 'image') {
      const data = node.data || { src: '' };
      if (updateImgUrl && typeof updateImgUrl === 'function') {
        const src = updateImgUrl(data.src);
        const newData = { ...data, ...{ src } };
        node.data = newData;
      }
    }
    // if node has children, traverse node's children
    if (node.children) {
      const nodes = node.children;
      replaceColumnData(nodes, columns, getCellValue, updateImgUrl);
    }
  }
};
