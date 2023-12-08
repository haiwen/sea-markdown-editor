import { useEffect } from 'react';
import EventBus from '../utils/event-bus';
import { EXTERNAL_EVENTS } from '../constants/event-types';
import { insertImage } from '../extension/plugins/image/helper';
import { insertLink } from '../extension/plugins/link/helper';

const useSeafileUtils = (editor) => {
  useEffect(() => {
    const insertSeafileImage = ({ title, url, isImage } ) => {
      if (isImage) {
        insertImage(editor, url, title);
      } else {
        insertLink({ editor, title, url });
      }
    };

    const eventBus = EventBus.getInstance();
    const subscribe = eventBus.subscribe(EXTERNAL_EVENTS.INSERT_IMAGE, insertSeafileImage);
    return subscribe;
  }, [editor]);
};

export default useSeafileUtils;
