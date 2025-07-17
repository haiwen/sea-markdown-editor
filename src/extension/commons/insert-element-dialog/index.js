import React, { useState, useCallback, useEffect } from 'react';
import { Editor } from 'slate';
import EventBus from '../../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../../constants/event-types';
import { ELementTypes } from '../../constants';
import LinkModal from '../../plugins/link/menu/link-modal';
import SplitCellSettingDialog from '../../plugins/table/dialogs/split-cell-setting-dialog';
import ImageMenuInsertInternetDialog from '../../plugins/image/menu/image-menu-dialog';
import FormulaModal from '../../plugins/formula/menu/formula-modal';

const InsertElementDialog = ({ editor }) => {
  const [dialogType, setDialogType] = useState('');
  const [isOpenLinkModal, setIsOpenLinkModal] = useState(false);
  const [formula, setFormula] = useState('');
  const [linkInfo, setLinkInfo] = useState({ linkTitle: '', linkUrl: '' });

  const toggleDialog = useCallback(({ type }) => {
    setDialogType(type);
    setIsOpenLinkModal(true);
    if (type === ELementTypes.LINK) {
      if (editor.selection) {
        const selectedText = Editor.string(editor, editor.selection);
        setLinkInfo({ ...linkInfo, linkTitle: selectedText });
      }
    }
  }, [editor, linkInfo]);

  const handleOpenLinkModal = useCallback((formulaElement) => {
    if (formulaElement) {
      const { formula } = formulaElement.data || {};
      setFormula(formula);
      setIsOpenLinkModal(true);
    }
  }, []);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const toggleDialogSubscribe = eventBus.subscribe(INTERNAL_EVENTS.INSERT_ELEMENT, toggleDialog);
    const unsubscribe = eventBus.subscribe(INTERNAL_EVENTS.ON_OPEN_FORMULA_DIALOG, handleOpenLinkModal);
    return () => {
      toggleDialogSubscribe();
      unsubscribe();
    };
  }, [toggleDialog, handleOpenLinkModal]);

  const onCloseModal = useCallback(() => {
    setIsOpenLinkModal(false);
    if (dialogType === ELementTypes.LINK) {
      setLinkInfo({ linkTitle: '', linkUrl: '' });
    }
    if (dialogType === ELementTypes.FORMULA) {
      setFormula('');
    }
  }, [dialogType]);

  if (ELementTypes.LINK === dialogType) {
    return (isOpenLinkModal && (
      <LinkModal
        onCloseModal={onCloseModal}
        editor={editor}
        linkTitle={linkInfo.linkTitle}
        linkUrl={linkInfo.linkUrl}
      />
    ));
  } else if (ELementTypes.TABLE_CELL === dialogType) {
    return (isOpenLinkModal && (
      <SplitCellSettingDialog
        closeDialog={onCloseModal}
        editor={editor}
      />
    ));
  } else if (ELementTypes.IMAGE === dialogType) {
    return (isOpenLinkModal && (
      <ImageMenuInsertInternetDialog
        closeDialog={onCloseModal}
        editor={editor}
      />
    ));
  } else if (ELementTypes.FORMULA === dialogType) {
    return (isOpenLinkModal && (
      <FormulaModal
        onCloseModal={onCloseModal}
        editor={editor}
        formula={formula}
      />
    ));
  } else {
    return null;
  }
};

export default InsertElementDialog;
