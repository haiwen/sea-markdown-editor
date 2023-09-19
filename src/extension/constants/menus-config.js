import {
  BLOCKQUOTE,
  ORDERED_LIST,
  UNORDERED_LIST,
  CHECK_LIST,
  CODE_BLOCK,
  LINK,
  IMAGE,
  TABLE,
  ITALIC,
  BOLD,
  HEADER,
} from './element-types';

export const MENUS_CONFIG_MAP = {
  [BLOCKQUOTE]: {
    id: `seafile_${BLOCKQUOTE}`,
    iconClass: 'iconfont icon-quote-left',
    text: 'Quote'
  },
  [ORDERED_LIST]: {
    id: ORDERED_LIST,
    iconClass: 'iconfont icon-list-ol',
    text: 'Ordered_list'
  },
  [UNORDERED_LIST]: {
    id: UNORDERED_LIST,
    iconClass: 'iconfont icon-list-ul',
    text: 'Unordered_list'
  },
  [CHECK_LIST]: {
    id: CHECK_LIST,
    iconClass: 'iconfont icon-check-square',
    text: 'Check_list_item'
  },
  [CODE_BLOCK]: {
    id: CODE_BLOCK,
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
    id: ITALIC,
    iconClass: 'iconfont icon-italic',
    text: 'Italic',
    type: 'ITALIC'
  },
  [BOLD]: {
    id: BOLD,
    iconClass: 'iconfont icon-bold',
    text: 'Bold',
    type: 'BOLD'
  },
  [HEADER]: {
    id: HEADER,
    id: `seafile_${HEADER}`,
  }
};
