import React from 'react';
import PropTypes from 'prop-types';
import { MenuGroup } from '../../commons';
import QuoteMenu from '../../plugins/blockquote/menu';
import useSelectionUpdate from '../../../hooks/use-selection-update';

import './style.css';

const Toolbar = ({ editor, readonly = false }) => {
  useSelectionUpdate();
  return (
    <div className='seafile-editor-toolbar'>
      <MenuGroup></MenuGroup>
      <MenuGroup>
        <QuoteMenu editor={editor} readonly={readonly}/>
      </MenuGroup>
    </div>
  );
};

Toolbar.defaultProps = {
  readonly: false,
};

Toolbar.propTypes = {
  readonly: PropTypes.bool,
  editor: PropTypes.object,
};

export default Toolbar;
