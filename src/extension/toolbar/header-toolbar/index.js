import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import useSelectionUpdate from '../../../hooks/use-selection-update';
import { MenuGroup } from '../../commons';
import QuoteMenu from '../../plugins/blockquote/menu';
import HeaderMenu from '../../plugins/header/menu';
import TextStyleMenu from '../../plugins/text-style/menu';
import LinkMenu from '../../plugins/link/menu';
import { TEXT_STYLE_MAP } from '../../constants';
import CheckListMenu from '../../plugins/check-list/menu';
import ListMenu from '../../plugins/list/menu';
import { ORDERED_LIST, UNORDERED_LIST } from '../../constants/element-types';
import FormulaMenu from '../../plugins/formula/menu';
import ClearFormatMenu from '../../plugins/clear-format/menu';
import KeyboardShortcuts from '../user-help/shortcut-dialog';
import ColumnMenu from '../../plugins/column/menu';
import InsertElementDialog from '../../commons/insert-element-dialog';
import InsertToolbar from './insert-toolbar';

import './style.css';

const Toolbar = ({ editor, readonly = false, isRichEditor = false, isSupportFormula = false, isSupportInsertSeafileImage = false, isSupportColumn = false }) => {
  useSelectionUpdate();

  const [isShowHelpModal, setIsShowHelpModal] = useState(false);
  const onHelpIconToggle = useCallback(() => {
    setIsShowHelpModal(!isShowHelpModal);
  }, [isShowHelpModal]);

  const commonProps = { editor, readonly, isRichEditor };

  return (
    <div className='sf-slate-editor-toolbar'>
      {isRichEditor && <MenuGroup></MenuGroup>}
      <MenuGroup >
        <InsertToolbar editor={editor} readonly={readonly} />
      </MenuGroup>
      <MenuGroup >
        <HeaderMenu {...commonProps} />
      </MenuGroup>
      <MenuGroup >
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.ITALIC} />
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.BOLD} />
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.UNDERLINE} />
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.CODE} />
        <LinkMenu {...commonProps} />
      </MenuGroup>
      <MenuGroup>
        <QuoteMenu {...commonProps} />
        <CheckListMenu {...commonProps} />
        <ListMenu {...commonProps} type={UNORDERED_LIST} />
        <ListMenu {...commonProps} type={ORDERED_LIST} />
      </MenuGroup>
      <MenuGroup>
        {isSupportFormula && <FormulaMenu {...commonProps} />}
        {isSupportColumn && <ColumnMenu {...commonProps} />}
      </MenuGroup>
      <MenuGroup>
        <ClearFormatMenu {...commonProps} />
      </MenuGroup>
      {!isRichEditor && (
        <div className='sf-slate-help-info-control' onClick={onHelpIconToggle}>
          <span className="iconfont icon-use-help"></span>
        </div>
      )}
      {isShowHelpModal && (
        <KeyboardShortcuts
          isRichEditor={isRichEditor}
          toggleShortcutDialog={onHelpIconToggle}
        />
      )}
      <InsertElementDialog editor={editor} />
    </div>
  );
};

Toolbar.propTypes = {
  readonly: PropTypes.bool,
  isRichEditor: PropTypes.bool,
  isSupportFormula: PropTypes.bool,
  isSupportInsertSeafileImage: PropTypes.bool,
  isSupportColumn: PropTypes.bool,
  editor: PropTypes.object,
};

export default Toolbar;
