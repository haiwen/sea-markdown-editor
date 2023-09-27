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
  [HEADER1]: 'header_one',
  [HEADER2]: 'header_two',
  [HEADER3]: 'header_three',
  [HEADER4]: 'header_four',
  [HEADER5]: 'header_five',
  [HEADER6]: 'header_six',
  [PARAGRAPH]: 'paragraph',
};

export const LIST_TYPE_ARRAY = ['unordered_list', 'ordered_list'];

export const INSERT_POSITION = {
  BEFORE: 'before',
  CURRENT: 'current',
  AFTER: 'after',
};
