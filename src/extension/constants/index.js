import { HEADER1, HEADER2, HEADER3, HEADER4, HEADER5, HEADER6, PARAGRAPH } from './element-types';

export * as ELementTypes from './element-types';
export * from './menus-config';

export const HEADERS = [
  HEADER1,
  HEADER2,
  HEADER3,
  HEADER4,
  HEADER5,
  HEADER6,
];

export const HEADER_TITLE_MAP = {
  [HEADER1]: 'Header_one',
  [HEADER2]: 'Header_two',
  [HEADER3]: 'Header_three',
  [HEADER4]: 'Header_four',
  [HEADER5]: 'Header_five',
  [HEADER6]: 'Header_six',
  [PARAGRAPH]: 'Paragraph',
};

export const LIST_TYPE_ARRAY = ['unordered_list', 'ordered_list'];

export const INSERT_POSITION = {
  BEFORE: 'before',
  CURRENT: 'current',
  AFTER: 'after',
};

export const TEXT_ALIGN = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
};
