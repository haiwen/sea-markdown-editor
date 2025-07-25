import {
  BLOCKQUOTE,
  ORDERED_LIST,
  UNORDERED_LIST,
  CHECK_LIST_ITEM,
  CODE_BLOCK,
  TABLE,
  LINK,
  IMAGE,
  FORMULA,
  COLUMN,
} from './element-types';

const BOLD = 'bold';
const ITALIC = 'italic';
const UNDERLINE = 'underline';
const CODE = 'code';
const DELETE = 'delete';
const ADD = 'add';

export const CLEAR_FORMAT = 'clear_format';
export const MORE_OPERATION = 'more_operation';
export const EXPAND_EDITOR = 'expand_editor';

export const TEXT_STYLE_MAP = {
  BOLD: BOLD,
  ITALIC: ITALIC,
  UNDERLINE: UNDERLINE,
  CODE: CODE,
  DELETE: DELETE,
  ADD: ADD,
  BOLD_ITALIC: `${BOLD}_${ITALIC}`,
};

export const TABLE_SUBMENU_MAP = {
  TABLE_ALIGN_LEFT: 'table_align_left',
  TABLE_ALIGN_CENTER: 'table_align_center',
  TABLE_ALIGN_RIGHT: 'table_align_right',
  TABLE_INSERT_COLUMN: 'table_insert_column',
  TABLE_DELETE_COLUMN: 'table_delete_column',
  TABLE_INSERT_ROW: 'table_insert_row',
  TABLE_DELETE_ROW: 'table_delete_row',
  TABLE_DELETE_TABLE: 'table_delete_table',
};

export const MENUS_CONFIG_MAP = {
  [BLOCKQUOTE]: {
    id: `seafile_${BLOCKQUOTE}`,
    iconClass: 'iconfont icon-quote',
    text: 'Quote'
  },
  [ORDERED_LIST]: {
    id: `seafile_${ORDERED_LIST}`,
    iconClass: 'iconfont icon-list-ol',
    text: 'Ordered_list'
  },
  [UNORDERED_LIST]: {
    id: `seafile_${UNORDERED_LIST}`,
    iconClass: 'iconfont icon-list-ul',
    text: 'Unordered_list'
  },
  [CHECK_LIST_ITEM]: {
    id: `seafle_${CHECK_LIST_ITEM}`,
    iconClass: 'iconfont icon-check-square',
    text: 'Check_list_item'
  },
  [CODE_BLOCK]: {
    id: `seafile_${CODE_BLOCK}`,
    iconClass: 'iconfont icon-code-block',
    text: 'Code_block'
  },
  [LINK]: {
    id: `seafile_${LINK}`,
    iconClass: 'iconfont icon-link',
    text: 'Insert_link'
  },
  [IMAGE]: {
    id: `seafile_${IMAGE}`,
    iconClass: 'iconfont icon-image',
    text: 'Insert_image'
  },
  [TABLE]: {
    id: `seafile_${TABLE}`,
    iconClass: 'iconfont icon-table',
    text: 'Insert_table'
  },
  [ITALIC]: {
    id: `seafile_${ITALIC}`,
    iconClass: 'iconfont icon-italic',
    text: 'Italic',
    type: ITALIC
  },
  [BOLD]: {
    id: `seafile_${BOLD}`,
    iconClass: 'iconfont icon-bold',
    text: 'Bold',
    type: BOLD
  },
  [UNDERLINE]: {
    id: `seafile_${UNDERLINE}`,
    iconClass: 'iconfont icon-underline',
    text: 'Underline',
    type: UNDERLINE
  },
  [CODE]: {
    id: `seafile_${CODE}`,
    iconClass: 'iconfont icon-code',
    text: 'Code',
    type: CODE,
  },
  [TABLE_SUBMENU_MAP.TABLE_ALIGN_LEFT]: {
    id: `seafile_${TABLE_SUBMENU_MAP.TABLE_ALIGN_LEFT}`,
    iconClass: 'iconfont icon-left-alignment',
    text: 'Left',
  },
  [TABLE_SUBMENU_MAP.TABLE_ALIGN_CENTER]: {
    id: `seafile_${TABLE_SUBMENU_MAP.TABLE_ALIGN_CENTER}`,
    iconClass: 'iconfont icon-center-horizontally',
    text: 'Center',
  },
  [TABLE_SUBMENU_MAP.TABLE_ALIGN_RIGHT]: {
    id: `seafile_${TABLE_SUBMENU_MAP.TABLE_ALIGN_RIGHT}`,
    iconClass: 'iconfont icon-align-right',
    text: 'Right',
  },
  [TABLE_SUBMENU_MAP.TABLE_INSERT_COLUMN]: {
    id: `seafile_${TABLE_SUBMENU_MAP.TABLE_INSERT_COLUMN}`,
    iconClass: 'iconfont icon-column',
    text: 'Insert_column',
  },
  [TABLE_SUBMENU_MAP.TABLE_DELETE_COLUMN]: {
    id: `seafile_${TABLE_SUBMENU_MAP.TABLE_DELETE_COLUMN}`,
    text: 'Delete_column',
  },
  [TABLE_SUBMENU_MAP.TABLE_INSERT_ROW]: {
    id: `seafile_${TABLE_SUBMENU_MAP.TABLE_INSERT_ROW}`,
    iconClass: 'iconfont icon-row',
    text: 'Insert_row',
  },
  [TABLE_SUBMENU_MAP.TABLE_DELETE_ROW]: {
    id: `seafile_${TABLE_SUBMENU_MAP.TABLE_DELETE_ROW}`,
    text: 'Delete_row',
  },
  [TABLE_SUBMENU_MAP.TABLE_DELETE_TABLE]: {
    id: `seafile_${TABLE_SUBMENU_MAP.TABLE_DELETE_TABLE}`,
    iconClass: 'iconfont icon-delete-table',
    text: 'Delete_table',
  },
  [FORMULA]: {
    id: `seafile_${FORMULA}`,
    iconClass: 'iconfont icon-formula',
    text: 'Insert_formula'
  },
  [CLEAR_FORMAT]: {
    id: `seafile_${CLEAR_FORMAT}`,
    iconClass: 'iconfont icon-clear-format',
    text: 'Clear_format'
  },
  [COLUMN]: {
    id: `seafile_${COLUMN}`,
    iconClass: 'iconfont icon-choose-column',
    text: 'Insert_column'
  },
  [MORE_OPERATION]: {
    id: `seafile_${MORE_OPERATION}`,
    iconClass: 'iconfont icon-more',
    text: ''
  },
  [EXPAND_EDITOR]: {
    id: `seafile_${EXPAND_EDITOR}`,
    iconClass: 'iconfont icon-fullscreen',
    text: 'Expand_editor'
  },
};
