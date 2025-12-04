import React from 'react';
import { ModalHeader as DefaultModalHeader } from 'reactstrap';

import './index.css';

function ModalHeader({ toggle, children }) {
  let close = null;
  if (toggle) {
    close = (
      <span className="sf-editor-close-icon" onClick={toggle}>
        <i className="sdocfont sdoc-sm-close" aria-hidden="true"></i>
      </span>
    );
  }
  return (
    <DefaultModalHeader close={close}>
      {children}
    </DefaultModalHeader>
  );
}

export default ModalHeader;
