import React, { useState, useCallback, useEffect } from 'react';
import { Editor } from 'slate';
import EventBus from '../../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../../constants/event-types';
import { ELementTypes } from '../../constants';
import LinkModal from '../../plugins/link/menu/link-modal';
import SplitCellSettingDialog from '../../plugins/table/dialogs/split-cell-setting-dialog';
import ImageMenuInsertInternetDialog from '../../plugins/image/menu/image-menu-dialog';

const InsertElementDialog = ({ editor }) => {
  const [dialogType, setDialogType] = useState('');
  const [isOpenLinkModal, setIsOpenLinkModal] = useState(false);
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

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const toggleDialogSubscribe = eventBus.subscribe(INTERNAL_EVENTS.INSERT_ELEMENT, toggleDialog);
    return () => {
      toggleDialogSubscribe();
    };
  }, [toggleDialog]);

  const onCloseModal = useCallback(() => {
    setIsOpenLinkModal(false);
    if (dialogType === ELementTypes.LINK) {
      setLinkInfo({ linkTitle: '', linkUrl: '' });
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
  } else {
    return null;
  }
};

export default InsertElementDialog;
