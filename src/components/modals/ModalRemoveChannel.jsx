import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import useConnection from '../../hooks/useConnection';

function ModalRemoveChannel() {
  const { removeChannel } = useConnection();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const idChannel = useSelector((state) => state.modals.id);

  const deleteChannel = () => {
    removeChannel({ id: idChannel });
  };

  return (
    <Modal show centered>
      <Modal.Header closeButton onClick={() => dispatch(modalsActions.hideModal())}>
        <Modal.Title>{t('remove channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('sure')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button type="close" onClick={() => dispatch(modalsActions.hideModal())} variant="secondary" className="btn btn-group-vertical">{t('cancel')}</Button>
        <Button type="submit" onClick={deleteChannel} className="btn-danger">{t('delete')}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalRemoveChannel;
