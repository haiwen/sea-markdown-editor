/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useState } from 'react';
import { LinkVerifiedDialog } from '../../../../components';

import './index.css';

const renderDefinition = ({ attributes, children, element }, editor) => {
  const [isShowConfirmDialog, setIsShowConfirmDialog] = useState(false);

  const onHrefClick = useCallback((event) => {
    event.preventDefault();
    if (element.url.startsWith(window.location.origin)) {
      window.open(element.url);
      return;
    }
    setIsShowConfirmDialog(true);
  }, [element.url]);

  const onToggle = useCallback(() => {
    setIsShowConfirmDialog(!isShowConfirmDialog);
  }, [isShowConfirmDialog]);

  return (
    <>
      <p
        data-url={element.url}
        data-id={element.id}
        className="sf-virtual-definition"
        {...attributes}
      >
        <span>{element.identifier + '. '}</span>
        <a href={element.url} data-url={element.url} onClick={onHrefClick}>{children}</a>
      </p>
      {isShowConfirmDialog && (
        <LinkVerifiedDialog link={element.url} onToggle={onToggle} />
      )}
    </>
  );
};

export default renderDefinition;
