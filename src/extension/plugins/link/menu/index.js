import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Editor } from 'slate';
import MenuItem from '../../../commons/menu/menu-item';
import { MENUS_CONFIG_MAP } from '../../../constants/menus-config';
import { LINK } from '../../../constants/element-types';
import { isLinkType, isMenuDisabled, unWrapLinkNode } from '../helper';
import EventBus from '../../../../utils/event-bus';
import LinkModal from './link-modal';
import { INTERNAL_EVENTS } from '../../../../constants/event-types';

const menuConfig = MENUS_CONFIG_MAP[LINK];

const LinkMenu = ({ isRichEditor, className, readonly, editor }) => {
  const [isOpenLinkModal, setIsOpenLinkModal] = useState(false);
  const [linkInfo, setLinkInfo] = useState({ linkTitle: '', linkUrl: '' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isLinkActive = useMemo(() => isLinkType(editor), [editor.selection]);

  useEffect(() => {
    const eventBus = EventBus.getInstance();
    const unsubscribe = eventBus.subscribe(INTERNAL_EVENTS.ON_OPEN_LINK_MODAL, handleOpenLinkModal);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLinkType(editor)) {
      const newTitle = editor.selection && Editor.string(editor, editor.selection);
      newTitle && setLinkInfo({ ...linkInfo, linkTitle: newTitle });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.selection]);

  const handleOpenLinkModal = useCallback((linkInfo) => {
    Reflect.ownKeys.length && setLinkInfo(linkInfo);
    setIsOpenLinkModal(true);
  }, [setIsOpenLinkModal, setLinkInfo]);

  const onMouseDown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLinkActive) {
      isLinkActive && unWrapLinkNode(editor);
      return;
    }
    if (editor.selection) {
      const selectedText = Editor.string(editor, editor.selection);
      setLinkInfo({ ...linkInfo, linkTitle: selectedText });
    }
    setIsOpenLinkModal(true);
    document.getElementById(`seafile_${LINK}`).blur();
  }, [editor, isLinkActive, linkInfo]);

  const onCloseModal = useCallback(() => {
    setIsOpenLinkModal(false);
    setLinkInfo({ linkTitle: '', linkUrl: '' });
  }, []);

  return (
    <>
      <MenuItem
        isRichEditor={isRichEditor}
        className={className}
        disabled={isMenuDisabled(editor, readonly)}
        isActive={isLinkActive}
        onMouseDown={onMouseDown}

        {...menuConfig}
      />
      {isOpenLinkModal && (
        <LinkModal
          onCloseModal={onCloseModal}
          editor={editor}
          linkTitle={linkInfo.linkTitle}
          linkUrl={linkInfo.linkUrl}
        />
      )}
    </>
  );
};

export default LinkMenu;
