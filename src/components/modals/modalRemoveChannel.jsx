import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions } from '../../slices/channelsSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import useAppContext from '../../hooks/index.jsx';

function modalRemoveChannel() {
  const dispatch = useDispatch();
  const idChannel = useSelector((state) => state.modals.id);
  const context = useAppContext();
  const [disabled, setDisabled] = useState(false);

  const removeChannel = () => {
    setDisabled(true);
    context.socket.emit('removeChannel', { id: idChannel }, (response) => {
      if (response.status === 'ok') {
        console.log('канал удален');
      } else {
        console.log('ошибка. канал не удален');
      }
    });
    context.socket.on('removeChannel', (channel) => {
      setDisabled(false);
      dispatch(channelsActions.removeChannel(channel.id));
      dispatch(channelsActions.setCurrentChannelId(1));
      dispatch(modalsActions.hideModal());
    });
    context.socket.on('disconnect', (reason) => {
      console.log('reason', reason);
    });
  };

  return (
    <Modal show centered>
      <Modal.Header closeButton onClick={() => dispatch(modalsActions.hideModal())}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Уверены?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button type="close" onClick={() => dispatch(modalsActions.hideModal())} variant="secondary" className="btn btn-group-vertical">Отменить</Button>
        <Button type="submit" disabled={disabled} onClick={removeChannel} className="btn btn-group-vertical">Удалить</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default modalRemoveChannel;
