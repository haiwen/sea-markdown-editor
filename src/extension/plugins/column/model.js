class Column {
  constructor(options) {
    this.type = options.type || 'column';
    this.data = options.data || { key: '', name: '', bold: false, italic: false };
    this.children = options.children || [{ text: '' }];
  }
}

export default Column;
