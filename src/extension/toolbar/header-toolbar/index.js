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

import './style.css';

const Toolbar = ({ editor, readonly = false, isSupportFormula }) => {
  useSelectionUpdate();

  const [isShowArticleInfo, setIsShowArticleInfo] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isShowSubtableMenu = useMemo(() => isInTable(editor), [editor.selection]);
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

  const sideIconClass = classNames('iconfont', {
    'icon-angle-double-left': !isShowArticleInfo,
    'icon-angle-double-right': isShowArticleInfo,
  });


  return (
    <div className='sf-markdown-editor-toolbar'>
      <MenuGroup></MenuGroup>
      <MenuGroup >
        <HeaderMenu editor={editor} readonly={readonly} />
      </MenuGroup>
      <MenuGroup >
        <TextStyleMenu editor={editor} readonly={readonly} type={TEXT_STYLE_MAP.BOLD} />
        <TextStyleMenu editor={editor} readonly={readonly} type={TEXT_STYLE_MAP.ITALIC} />
        <TextStyleMenu editor={editor} readonly={readonly} type={TEXT_STYLE_MAP.CODE} />
        <LinkMenu editor={editor} readonly={readonly} />
      </MenuGroup>
      <MenuGroup>
        <QuoteMenu editor={editor} readonly={readonly} />
        <CheckListMenu editor={editor} readonly={readonly} />
        <ListMenu editor={editor} readonly={readonly} type={ORDERED_LIST} />
        <ListMenu editor={editor} readonly={readonly} type={UNORDERED_LIST} />
      </MenuGroup>
      <MenuGroup>
        <CodeBlockMenu editor={editor} readonly={readonly} />
        <TableMenu editor={editor} readonly={readonly} />
        <ImageMenu editor={editor} readonly={readonly} />
        {isSupportFormula && <FormulaMenu editor={editor} readonly={readonly} />}
      </MenuGroup>
      {isShowSubtableMenu && (
        <MenuGroup>
          <AlignmentDropDown editor={editor} readonly={readonly} />
          <ColumnOperationDropDownList editor={editor} readonly={readonly} />
          <RowOperationDropDownList editor={editor} readonly={readonly} />
          <RemoveTableMenu editor={editor} readonly={readonly} />
        </MenuGroup>
      )}
      <MenuGroup>
        <ClearFormatMenu editor={editor} readonly={readonly} />
      </MenuGroup>
      <div className='sf-markdown-article-info-control' onClick={updateArticleInfoState}>
        <span className={sideIconClass}></span>
      </div>
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
