import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EXTERNAL_EVENTS, INTERNAL_EVENTS } from '../../../constants/event-types';
import useSelectionUpdate from '../../../hooks/use-selection-update';
import EventBus from '../../../utils/event-bus';
import { MenuGroup } from '../../commons';
import QuoteMenu from '../../plugins/blockquote/menu';
import HeaderMenu from '../../plugins/header/menu';
import TextStyleMenu from '../../plugins/text-style/menu';
import LinkMenu from '../../plugins/link/menu';
import { TEXT_STYLE_MAP } from '../../constants';
import ImageMenu from '../../plugins/image/menu';
import CodeBlockMenu from '../../plugins/code-block/menu';
import CheckListMenu from '../../plugins/check-list/menu';
import ListMenu from '../../plugins/list/menu';
import { ORDERED_LIST, UNORDERED_LIST } from '../../constants/element-types';
import TableMenu from '../../plugins/table/menu';
import { AlignmentDropDown, ColumnOperationDropDownList, RowOperationDropDownList, RemoveTableMenu } from '../../plugins/table/menu/table-operator';
import { isInTable } from '../../plugins/table/helper';
import FormulaMenu from '../../plugins/formula/menu';
import ClearFormatMenu from '../../plugins/clear-format/menu';
import KeyboardShortcuts from '../user-help/shortcut-dialog';

import './style.css';

const Toolbar = ({ editor, readonly = false, isRichEditor = false, isSupportFormula = false }) => {
  useSelectionUpdate();

  const [isShowArticleInfo, setIsShowArticleInfo] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isShowSubTableMenu = useMemo(() => isInTable(editor), [editor.selection]);
  const updateArticleInfoState = useCallback(() => {
    const newState = !isShowArticleInfo;
    setIsShowArticleInfo(newState);
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.ON_ARTICLE_INFO_TOGGLE, newState);
  }, [isShowArticleInfo]);

  const onHelpInfoToggle = useCallback((state) => {
    if (state) setIsShowArticleInfo(false);
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    // Trigger external events and close article info
    const unsubscribeHelpInfo = eventBus.subscribe(EXTERNAL_EVENTS.ON_HELP_INFO_TOGGLE, onHelpInfoToggle);
    return () => {
      unsubscribeHelpInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isShowHelpModal, setIsShowHelpModal] = useState(false);
  const onHelpIconToggle = useCallback(() => {
    setIsShowHelpModal(!isShowHelpModal);
  }, [isShowHelpModal]);

  const sideIconClass = classNames('iconfont', {
    'icon-angle-double-left': !isShowArticleInfo,
    'icon-angle-double-right': isShowArticleInfo,
  });

  const commonProps = { editor, readonly, isRichEditor };

  return (
    <div className='sf-slate-editor-toolbar'>
      <MenuGroup></MenuGroup>
      <MenuGroup >
        <HeaderMenu {...commonProps} />
      </MenuGroup>
      <MenuGroup >
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.BOLD} />
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.ITALIC} />
        <TextStyleMenu {...commonProps} type={TEXT_STYLE_MAP.CODE} />
        <LinkMenu {...commonProps} />
      </MenuGroup>
      <MenuGroup>
        <QuoteMenu {...commonProps} />
        <CheckListMenu {...commonProps} />
        <ListMenu {...commonProps} type={ORDERED_LIST} />
        <ListMenu {...commonProps} type={UNORDERED_LIST} />
      </MenuGroup>
      <MenuGroup>
        <CodeBlockMenu {...commonProps} />
        <TableMenu {...commonProps} />
        <ImageMenu {...commonProps} />
        {isSupportFormula && <FormulaMenu {...commonProps} />}
      </MenuGroup>
      {isShowSubTableMenu && (
        <MenuGroup>
          <AlignmentDropDown {...commonProps} />
          <ColumnOperationDropDownList {...commonProps} />
          <RowOperationDropDownList {...commonProps} />
          <RemoveTableMenu {...commonProps} />
        </MenuGroup>
      )}
      <MenuGroup>
        <ClearFormatMenu {...commonProps} />
      </MenuGroup>
      {isRichEditor && (
        <div className='sf-slate-article-info-control' onClick={updateArticleInfoState}>
          <span className={sideIconClass}></span>
        </div>
      )}
      {!isRichEditor && (
        <div className='sf-slate-help-info-control' onClick={onHelpIconToggle}>
          <span className="iconfont icon-use-help"></span>
        </div>
      )}
      {isShowHelpModal && (
        <KeyboardShortcuts
          toggleShortcutDialog={onHelpIconToggle}
        />
      )}
    </div>
  );
};

Toolbar.defaultProps = {
  readonly: false,
};

Toolbar.propTypes = {
  readonly: PropTypes.bool,
  editor: PropTypes.object,
};

export default Toolbar;
