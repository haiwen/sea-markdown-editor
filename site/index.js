import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import Loading from './commons/loading';
import i18n from './_i18n';
import App from './app';

export default function Index() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </I18nextProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Index />, );
