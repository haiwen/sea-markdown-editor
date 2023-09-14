import React, { Suspense } from 'react';
import ReactDom from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import Loading from './commons/loading';
import i18n from './_i18n';
import SeafileEditor from './pages/seafile-editor';

import './assets/css/reset.css';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<Loading />}>
        <SeafileEditor />
      </Suspense>
    </I18nextProvider>
  );
}

ReactDom.render(<App />, document.getElementById('root'));
