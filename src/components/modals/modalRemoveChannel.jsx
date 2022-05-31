import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { actions as channelsActions } from '../../slices/channelsSlice.js';

function modalRemoveChannel(props) {
  const socket = io();
  const dispatch = useDispatch();
  const { onHide, modalInfo, changeIdOpenedMenu } = props;

  const removeChannel = () => {
    socket.emit('removeChannel', modalInfo, (response) => {
      if (response.status === 'ok') {
        console.log('канал удален');
      } else {
        console.log('ошибка. канал не удален');
      }
    });
    socket.on('removeChannel', (channel) => {
      dispatch(channelsActions.removeChannel(channel.id));
      dispatch(channelsActions.setCurrentChannelId(1));
    });
    onHide();
    changeIdOpenedMenu();
  };

  return (
    <Modal show centered>
      <Modal.Header closeButton onClick={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Уверены?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button type="close" onClick={onHide} variant="secondary" className="btn btn-group-vertical">Отменить</Button>
        <Button type="submit" onClick={removeChannel} className="btn btn-group-vertical">Удалить</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default modalRemoveChannel;
