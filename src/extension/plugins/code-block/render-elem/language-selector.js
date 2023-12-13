import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { EXPLAIN_TEXT, LANGUAGE_MAP } from './constant';

import './style.css';

const LanguageSelector = ({ handleLangSelectorChange, lang = EXPLAIN_TEXT }) => {
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
      onChange={e => handleLangSelectorChange(e.target.value)}
    >
      {langOptions}
    </select>
  );
};

LanguageSelector.propTypes = {
  lang: PropTypes.string,
  handleLangSelectorChange: PropTypes.func
};

export default LanguageSelector;
