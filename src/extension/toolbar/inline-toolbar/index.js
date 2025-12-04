import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import useSelectionUpdate from '../../../hooks/use-selection-update';
import { MenuGroup, ExpandEditorMenu, MoreMenu } from '../../commons';
import QuoteMenu from '../../plugins/blockquote/menu';
import HeaderMenu from '../../plugins/header/menu';
import TextStyleMenu from '../../plugins/text-style/menu';
import LinkMenu from '../../plugins/link/menu';
import { TEXT_STYLE_MAP } from '../../constants';
import CheckListMenu from '../../plugins/check-list/menu';
import ListMenu from '../../plugins/list/menu';
import { ORDERED_LIST, UNORDERED_LIST } from '../../constants/element-types';
import ClearFormatMenu from '../../plugins/clear-format/menu';
import KeyboardShortcuts from '../user-help/shortcut-dialog';
import InsertToolbar from '../header-toolbar/insert-toolbar';
import ImageMenuInsertInternetDialog from '../../plugins/image/menu/image-menu-dialog';

import './index.css';

const InlineToolbar = ({ editor, readonly = false, isRichEditor = false, isSupportFormula = false, isSupportInsertSeafileImage = false, isSupportColumn = false, onExpandEditorToggle }) => {
  useSelectionUpdate();

  const [isShowInternetImageModal, setIsShowInternetImageModal] = useState(false);
  const [isShowHelpModal, setIsShowHelpModal] = useState(false);
  const onHelpIconToggle = useCallback(() => {
    setIsShowHelpModal(!isShowHelpModal);
  }, [isShowHelpModal]);

  const onToggleImageDialog = useCallback(() => {
    setIsShowInternetImageModal(false);
  }, []);

  const commonProps = { editor, readonly, isRichEditor };

  return (
    <div className='sf-slate-editor-toolbar'>
      {isRichEditor && <MenuGroup></MenuGroup>}
      <MenuGroup >
        <InsertToolbar editor={editor} readonly={readonly} isSupportFormula={isSupportFormula} isSupportColumn={isSupportColumn} setIsShowInternetImageModal={setIsShowInternetImageModal} />
      </MenuGroup>
      <MenuGroup>
        <HeaderMenu {...commonProps} />
      </MenuGroup>
      <MenuGroup>
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.ITALIC} />
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.BOLD} />
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.UNDERLINE} />
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.CODE} />
        <LinkMenu {...commonProps} />
      </MenuGroup>
      <MenuGroup>
        <QuoteMenu {...commonProps} />
        <CheckListMenu {...commonProps} />
      </MenuGroup>
      <MenuGroup>
        <MoreMenu {...commonProps} >
          <MenuGroup>
            <ListMenu {...commonProps} type={UNORDERED_LIST} />
            <ListMenu {...commonProps} type={ORDERED_LIST} />
            <ClearFormatMenu {...commonProps} />
          </MenuGroup>
          {!isRichEditor && (
            <div className='sf-menu-group-item sf-slate-help-info-control' onClick={onHelpIconToggle}>
              <span className="sdocfont sdoc-use-help"></span>
            </div>
          )}
        </MoreMenu>
      </MenuGroup>
      {onExpandEditorToggle && (
        <MenuGroup>
          {onExpandEditorToggle && (<ExpandEditorMenu {...commonProps} onExpandEditorToggle={onExpandEditorToggle} />)}
        </MenuGroup>
      )}
      {isShowHelpModal && (
        <KeyboardShortcuts isRichEditor={isRichEditor} toggleShortcutDialog={onHelpIconToggle} />
      )}
      {isShowInternetImageModal && (
        <ImageMenuInsertInternetDialog
          editor={editor}
          closeDialog={onToggleImageDialog}
        />
      )}
    </div>
  );
};

InlineToolbar.propTypes = {
  readonly: PropTypes.bool,
  isRichEditor: PropTypes.bool,
  isSupportFormula: PropTypes.bool,
  isSupportInsertSeafileImage: PropTypes.bool,
  isSupportColumn: PropTypes.bool,
  editor: PropTypes.object,
  onExpandEditorToggle: PropTypes.func,
};

export default InlineToolbar;
