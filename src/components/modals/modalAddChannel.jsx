import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions, selectors as channelsSelectors } from '../../slices/channelsSlice.js';
import validateModal from '../../validateModal.js';

function modalAddChannel(props) {
  const [failedValue, setFailedValue] = useState(false);
  const [validationError, setValidationError] = useState('');
  const socket = io();
  const dispatch = useDispatch();
  const { onHide } = props;
  const channels = useSelector(channelsSelectors.selectAll);
  const namesChannels = channels.map((channel) => channel.name);
  const formik = useFormik({
    initialValues: { name: '' },
    onSubmit: (values) => {
      try {
        validateModal(values.name, namesChannels);
        socket.emit('newChannel', values, (response) => {
          if (response.status === 'ok') {
            console.log('канал добавлен');
          } else {
            console.log('ошибка. канал не добавлен');
          }
        });

        socket.on('newChannel', (channel) => {
          console.log(channel);
          dispatch(channelsActions.addOneChannel(channel));
          dispatch(channelsActions.setCurrentChannelId(channel.id));
        });
        onHide();
      } catch (e) {
        setValidationError(e.message);
        setFailedValue(true);
      }
    },
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onClick={onHide}>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Modal.Body>
            <Form.Control
              required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              data-testid="input-name"
              name="name"
              isInvalid={failedValue}
            />
            <Form.Control.Feedback type="invalid">{validationError}</Form.Control.Feedback>
          </Modal.Body>
          <Modal.Footer>
            <Button type="close" onClick={onHide} variant="secondary" className="btn btn-group-vertical">Отменить</Button>
            <Button type="submit" className="btn btn-group-vertical">Отправить</Button>
          </Modal.Footer>
        </Form.Group>
      </Form>
    </Modal>
  );
}

export default modalAddChannel;
