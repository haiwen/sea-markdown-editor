import { useEffect } from 'react';
import EventBus from '../utils/event-bus';
import { EXTERNAL_EVENTS } from '../constants/event-types';
import { insertSeafileImage } from '../extension/plugins/image/helper';
import { insertSeafileLink } from '../extension/plugins/link/helper';

const useAttachments = (editor) => {
  useEffect(() => {
    const insertImage = (targetEditor, { title, url, isImage, selection = editor.selection }) => {
      if (targetEditor?._id !== editor._id) return;
      if (isImage) {
        insertSeafileImage({ editor, title, url, selection });
      } else {
        insertSeafileLink({ editor, title, url, selection });
      }
    };

    const eventBus = EventBus.getInstance();
    const subscribe = eventBus.subscribe(EXTERNAL_EVENTS.INSERT_ATTACHMENTS, insertImage);
    return subscribe;
  }, [editor]);
};

export default useAttachments;
