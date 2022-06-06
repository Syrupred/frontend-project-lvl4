import React from 'react';
import { useTranslation } from 'react-i18next';

function NoMatch() {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <h1 className="h4 text-muted">{t('page not found')}</h1>
      <p className="text-muted">
        {t('but you can go')}
        <a href="/">{t('to home page')}</a>
      </p>
    </div>

  );
}

export default NoMatch;
