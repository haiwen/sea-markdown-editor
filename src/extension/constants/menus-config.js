import {
  BLOCKQUOTE,
  ORDERED_LIST,
  UNORDERED_LIST,
  CHECK_LIST_ITEM,
  CODE_BLOCK,
  TABLE,
  LINK,
  IMAGE,
} from './element-types';

const BOLD = 'bold';
const ITALIC = 'italic';
const UNDERLINE = 'underline';
const CODE = 'code';
const DELETE = 'delete';
const ADD = 'add';

export const TEXT_STYLE_MAP = {
  BOLD: BOLD,
  ITALIC: ITALIC,
  UNDERLINE: UNDERLINE,
  CODE: CODE,
  DELETE: DELETE,
  ADD: ADD,
};

export const MENUS_CONFIG_MAP = {
  [BLOCKQUOTE]: {
    id: `seafile_${BLOCKQUOTE}`,
    iconClass: 'iconfont icon-quote-left',
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
  [CODE]: {
    id: `seafile_${CODE}`,
    iconClass: 'iconfont icon-code',
    text: 'Code',
    type: CODE,
  },
};
