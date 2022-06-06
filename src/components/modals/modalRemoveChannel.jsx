import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../../slices/channelsSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import socket from '../../socketApi.js';

function modalRemoveChannel() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const idChannel = useSelector((state) => state.modals.id);
  const [disabled, setDisabled] = useState(false);

  const removeChannel = () => {
    setDisabled(true);
    socket.emit('removeChannel', { id: idChannel }, (response) => {
      if (response.status === 'ok') {
        console.log('канал удален');
      } else {
        console.log('ошибка. канал не удален');
      }
    });
    socket.on('removeChannel', (channel) => {
      setDisabled(false);
      dispatch(channelsActions.removeChannel(channel.id));
      dispatch(channelsActions.setCurrentChannelId(1));
      dispatch(modalsActions.hideModal());
      toast.success(t('channel removed'), {
        toastId: channel.id,
      });
    });
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
        <Button type="submit" disabled={disabled} onClick={removeChannel} className="btn btn-group-vertical">{t('delete')}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default modalRemoveChannel;
