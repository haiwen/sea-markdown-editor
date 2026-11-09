import React from 'react';
import { INTERNAL_EVENTS } from '../../../../constants/event-types';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { FORMULA } from '../../../constants/element-types';
import EventBus from '../../../../utils/event-bus';
import DropdownMenuItem from '../../../commons/dropdown-menu-item';
import { isMenuDisabled } from '../helper';

const menuConfig = MENUS_CONFIG_MAP[FORMULA];

const FormulaMenu = ({ editor, readonly, toggle }) => {

  const disabled = isMenuDisabled(editor, readonly);

  const OpenFormulaModal = () => {
    toggle && toggle();
    const eventBus = EventBus.getInstance();
    eventBus.dispatch(INTERNAL_EVENTS.INSERT_ELEMENT, { type: FORMULA });
  };

  return (
    <DropdownMenuItem disabled={disabled} menuConfig={menuConfig} className="pr-2" onClick={OpenFormulaModal}>
    </DropdownMenuItem>
  );
};

export default FormulaMenu;
