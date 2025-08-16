import { useEffect } from 'react';
import EventBus from '../utils/event-bus';
import { EXTERNAL_EVENTS } from '../constants/event-types';
import { insertSeafileImage } from '../extension/plugins/image/helper';
import { insertSeafileLink } from '../extension/plugins/link/helper';

const useSeafileUtils = (editor) => {
  useEffect(() => {
    const insertImage = ({ title, url, isImage, selection = editor.selection }) => {
      if (isImage) {
        insertSeafileImage({ editor, title, url, selection });
      } else {
        insertSeafileLink({ editor, title, url, selection });
      }
    };

    const eventBus = EventBus.getInstance();
    const subscribe = eventBus.subscribe(EXTERNAL_EVENTS.INSERT_IMAGE, insertImage);
    return subscribe;
  }, [editor]);
};

export default useSeafileUtils;
