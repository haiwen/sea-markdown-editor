import React from 'react';
import PropTypes from 'prop-types';
import SidePanel from '.';
import { EXTERNAL_EVENTS } from '../../constants/event-types';

const CommentPanel = ({ isVisible }) => {
  return (
    <SidePanel
      isVisible={isVisible}
      eventType={EXTERNAL_EVENTS.ON_COMMENT_PANEL_TOGGLE}
    />
  );
};

CommentPanel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default CommentPanel;
