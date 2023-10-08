import React, { useEffect, useMemo, useState } from 'react';
import { LANGUAGE_MAP } from './constant';

import './style.css';

const LanguageSelector = ({ lang, onLangChange }) => {
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
    <>
      <select defaultValue={'none'} onChange={e => onchange(e.target.value)} className='sf-lang-selector'>{langOptions}</select>
    </>
  );
};

export default LanguageSelector;
