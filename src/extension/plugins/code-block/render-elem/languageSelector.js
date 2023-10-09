import React, { useMemo } from 'react';
import { useSlate } from 'slate-react';
import PropTypes from 'prop-types';
import { EXPLAIN_TEXT, LANGUAGE_MAP } from './constant';
import { setCodeBlockLanguage } from '../helpers';

import './style.css';

const LanguageSelector = ({ lang = EXPLAIN_TEXT }) => {
  const editor = useSlate();
  const langOptions = useMemo(() => {
    const options = [];
    for (const value in LANGUAGE_MAP) {
      if (Object.hasOwnProperty.call(LANGUAGE_MAP, value)) {
        const name = LANGUAGE_MAP[value];
        options.push(<option key={value} value={value}>{name}</option>);
      }
    }
    return options;
  }, []);

  return (
    <select
      name='language'
      className='sf-lang-selector'
      value={lang}
      onChange={e => setCodeBlockLanguage(editor, e.target.value)}
    >
      {langOptions}
    </select>
  );
};

LanguageSelector.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default LanguageSelector;
