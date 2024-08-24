import React, {useState, useCallback, useEffect } from 'react';
import { Editor } from 'slate';
import EventBus from '../../../utils/event-bus';
import { INTERNAL_EVENTS } from '../../../constants/event-types';
import { ELementTypes } from '../../constants';
import LinkModal from '../../plugins/link/menu/link-modal';

const InsertElementDialog = ({ editor }) => {
    const [dialogType, setDialogType] = useState('');
    const [isOpenLinkModal, setIsOpenLinkModal] = useState(false);
    const [linkInfo, setLinkInfo] = useState({ linkTitle: '', linkUrl: '' });

    useEffect(() => {
        const eventBus = EventBus.getInstance();
        const toggleDialogSubscribe = eventBus.subscribe(INTERNAL_EVENTS.INSERT_ELEMENT, toggleDialog);
        return () => {
          toggleDialogSubscribe();
        };
      }, []);

    const toggleDialog = useCallback(({ type }) => {
        setDialogType(type);
        setIsOpenLinkModal(true);
        if (editor.selection) {
            const selectedText = Editor.string(editor, editor.selection);
            setLinkInfo({ ...linkInfo, linkTitle: selectedText });
          }
    }, [editor, setIsOpenLinkModal, setLinkInfo, setDialogType]);

    const onCloseModal = useCallback(() => {
        setIsOpenLinkModal(false);
        setLinkInfo({ linkTitle: '', linkUrl: '' });
      }, []);
    
    if (ELementTypes.LINK === dialogType) {
        return (isOpenLinkModal && (
            <LinkModal
              onCloseModal={onCloseModal}
              editor={editor}
              linkTitle={linkInfo.linkTitle}
              linkUrl={linkInfo.linkUrl}
            />
          ))
    } else {
        return null;
    }
};

export default InsertElementDialog;
