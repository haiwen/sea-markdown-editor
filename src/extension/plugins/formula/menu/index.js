import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { INTERNAL_EVENTS } from '../../../../constants/event-types';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { FORMULA } from '../../../constants/element-types';
import MenuItem from '../../../commons/menu/menu-item';
import { isFormulaActive, isMenuDisabled } from '../helper';
import EventBus from '../../../../utils/event-bus';
import FormulaModal from './formula-modal';

const menuConfig = MENUS_CONFIG_MAP[FORMULA];

const FormulaMenu = ({ isRichEditor, className, readonly, editor }) => {
  const [isOpenFormulaModal, setIsOpenFormulaModal] = useState(false);
  const [formula, setFormula] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isMenuActive = useMemo(() => isFormulaActive(editor), [editor.selection]);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribe = eventBus.subscribe(INTERNAL_EVENTS.ON_OPEN_LINK_POPOVER, handleOpenLinkModal);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseDown = useCallback(() => {
    setIsOpenFormulaModal(true);
  }, []);

  const handleOpenLinkModal = useCallback((formulaElement) => {
    if (formulaElement) {
      const { formula } = formulaElement.data || {};
      setFormula(formula);
      setIsOpenFormulaModal(true);
    }
  }, []);

  const onCloseModal = useCallback(() => {
    setIsOpenFormulaModal(false);
    setFormula('');
  }, []);

  return (
    <>
      <MenuItem
        isRichEditor={isRichEditor}
        className={className}
        disabled={isMenuDisabled(editor, readonly)}
        isActive={isMenuActive}
        onMouseDown={onMouseDown}
        {...menuConfig}
      />
      {isOpenFormulaModal && (
        <FormulaModal
          editor={editor}
          formula={formula}
          onCloseModal={onCloseModal}
        />
      )}
    </>
  );
};

export default FormulaMenu;
