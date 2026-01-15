import React from 'react';
import PropTypes from 'prop-types';
import SidePanel from '.';
import { EXTERNAL_EVENTS } from '../../constants/event-types';

const ArticleInfo = ({ isVisible }) => {
  return (
    <SidePanel
      isVisible={isVisible}
      eventType={EXTERNAL_EVENTS.ON_ARTICLE_INFO_TOGGLE}
    />
  );
};

ArticleInfo.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default ArticleInfo;
