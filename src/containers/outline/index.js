import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import OutlineItem from './outline-item';

import './style.css';

const getHeaderList = (children) => {
  const headerList = [];
  children.forEach((node) => {
    if (node.type === 'header2' || node.type === 'header3') {
      headerList.push(node);
    }
  });
  return headerList;
};

const Outline = ({ editor }) => {
  const { t } = useTranslation();
  const [headerList, setHeaderList] = useState([]);
  useEffect(() => {
    const headerList = getHeaderList(editor.children);
    setHeaderList(headerList);
  }, [editor.children]);

  return (
    <div className="sf-editor-outline">
      {headerList.length === 0 && (
        <div className="empty-container">{t('No_out_line')}</div>
      )}
      {headerList.length > 0 && headerList.map((node, index) => {
        return <OutlineItem key={index} node={node}/>;
      })}
    </div>
  );
};

Outline.propTypes = {
  editor: PropTypes.object,
};

export default Outline;
