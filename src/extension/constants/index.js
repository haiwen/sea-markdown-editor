import { HEADER1, HEADER2, HEADER3, HEADER4, HEADER5, HEADER6, PARAGRAPH, SUBTITLE, TITLE, } from './element-types';

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
  [TITLE]: 'Title',
  [SUBTITLE]: 'Subtitle',
  [HEADER1]: 'Header_one',
  [HEADER2]: 'Header_two',
  [HEADER3]: 'Header_three',
  [HEADER4]: 'Header_four',
  [HEADER5]: 'Header_five',
  [HEADER6]: 'Header_six',
  [PARAGRAPH]: 'Paragraph',
};

export const INTERNAL_EVENT = {
  CANCEL_TABLE_SELECT_RANGE: 'cancel_table_select_range',
  SET_TABLE_SELECT_RANGE: 'set_table_select_range',
  HIDDEN_CODE_BLOCK_HOVER_MENU: 'hidden_code_block_hover_menu',
  ON_MOUSE_ENTER_BLOCK: 'on_mouse_enter_block',
  INSERT_ELEMENT: 'insert_element',
};

export const LIST_TYPE_ARRAY = ['unordered_list', 'ordered_list'];

