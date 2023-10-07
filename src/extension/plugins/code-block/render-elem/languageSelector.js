import React, { useEffect, useMemo } from 'react';
import { LANGUAGE_MAP } from './constant';

import './style.css';

const LanguageSelector = () => {
  useEffect(() => {

  });
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
      <select defaultValue={LANGUAGE_MAP.none} className='sf-lang-selector'>{langOptions}</select>
    </>
  );
};

export default LanguageSelector;
