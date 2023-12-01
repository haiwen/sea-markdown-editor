import { generateElement } from '../../core';
import { TABLE, TABLE_CELL, TABLE_ROW } from '../../constants/element-types';
import { TEXT_ALIGN } from '../../constants';

/**
 * @param {Object} options
 * @param {Node[] | String} [options.childrenOrText = ''] If provide a string,that will generate a text node as children automatically
 * @param {keyof TEXT_ALIGN} [options.align = TEXT_ALIGN.left]
*/
const generateTableCell = (options = {}) => {
  const { align = TEXT_ALIGN.LEFT, childrenOrText = '' } = options;
  return generateElement(TABLE_CELL, {
    childrenOrText,
    props: { align, },
  });
};

/**
 * @param {Object} options
 * @param {Node[] | String} [options.childrenOrText = ''] If provide a string,that will generate a text node as children automatically
 * @param {number | undefined} columnNum If provide a number,that will generate a table row with the number of cells,or will fill the childrenOrText as cells,or will generate a empty cell(if not provide childrenOrText)
 */
const generateTableRow = (options) => {
  const { columnNum } = options;
  let { childrenOrText = '' } = options;
  let cells = [];
  if (columnNum) {
    cells = Array.from({ length: columnNum }, () => generateTableCell());
  } else {
    // If not type of string,we'll consider it as a cell array,or throw an error
    if (typeof childrenOrText === 'string') {
      childrenOrText = [generateTableCell({ childrenOrText })];
    }
    if (!Array.isArray(childrenOrText)) {
      throw Error('childrenOrText must be a string or a Node array!');
    }
  }
  return generateElement(TABLE_ROW, { childrenOrText: columnNum ? cells : childrenOrText, });
};

/**
 * @param {Object} options
 * @param {Node[] | String} [options.childrenOrText = ''] If provide a string,that will generate a text node as children automatically
 * @param {number | undefined} rowNum If provide a number,that will generate a table with the number of rows,or will fill the childrenOrText as rows,or will generate a empty row(if not provide childrenOrText)
 * @param {number | undefined} columnNum If provide a number,that will generate a table row with the number of cells,or will fill the childrenOrText as cells,or will generate a empty cell(if not provide childrenOrText)
 */
const generateTable = (options) => {
  const { rowNum, columnNum } = options;
  let { childrenOrText = '' } = options;
  let rows = [];
  if (rowNum) {
    rows = Array.from({ length: rowNum }, () => generateTableRow({ columnNum }));
  } else {
    // If not type of string,we'll consider it as a row array,or throw an error
    if (typeof childrenOrText === 'string') {
      childrenOrText = [generateTableRow({ childrenOrText })];
    }
    if (!Array.isArray(childrenOrText)) {
      throw Error('childrenOrText must be a string or a Node array!');
    }
  }
  return generateElement(TABLE, { childrenOrText: rowNum ? rows : childrenOrText, });
};

export {
  generateTableCell,
  generateTableRow,
  generateTable,
};
