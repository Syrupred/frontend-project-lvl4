import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function Menu({ id, showModal, deleteMenu }) {
  const { t } = useTranslation();
  useEffect(() => {
    document.addEventListener('click', deleteMenu);
    return () => document.removeEventListener('click', deleteMenu);
  }, []);

  return (

    <div
      aria-labelledby="react-aria9811200575-3"
      x-placement="bottom-start"
      className="dropdown-menu show"
      data-popper-reference-hidden="false"
      data-popper-escaped="false"
      data-popper-placement="bottom-start"
      style={{
        position: 'absolute', inset: 'auto auto 0px 0px', transform: 'translate(130px, 85px)',
      }}
    >
      <Button onClick={showModal('removing', id)} data-rr-ui-dropdown-item className="dropdown-item" role="button" tabIndex="0">{t('delete')}</Button>
      <Button onClick={showModal('renaming', id)} data-rr-ui-dropdown-item className="dropdown-item" role="button" tabIndex="0">{t('rename')}</Button>
    </div>

  );
}

export default Menu;
