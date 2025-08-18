const { useEffect } = require('react');
const { EXTERNAL_EVENTS } = require('../constants/event-types');
const { default: EventBus } = require('../utils/event-bus');

const useLinkClick = (editorId, callback) => {
  useEffect(() => {
    function onLinkClick(event, sourceEditorId) {
      event.preventDefault();
      event.stopPropagation();
      let link = '';
      let target = event.target;
      while (!target.dataset || !target.dataset.url) {
        target = target.parentNode;
      }
      if (!target) return;
      link = target.dataset.url;
      if (editorId !== sourceEditorId) return;
      if (callback) {
        callback(link);
      } else {
        window.open(link);
      }
    }

    const eventBus = EventBus.getInstance();
    const unsubscribe = eventBus.subscribe(EXTERNAL_EVENTS.ON_LINK_CLICK, onLinkClick);
    return unsubscribe;
  }, [editorId, callback]);
};

export default useLinkClick;
