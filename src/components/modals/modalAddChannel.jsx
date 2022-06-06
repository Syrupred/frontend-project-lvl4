import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Form, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions, selectors as channelsSelectors } from '../../slices/channelsSlice.js';
import validateModal from '../../validateModal.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import socket from '../../socketApi.js';

function modalAddChannel() {
  const { t } = useTranslation();
  const [failedValue, setFailedValue] = useState(false);
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const channels = useSelector(channelsSelectors.selectAll);
  const namesChannels = channels.map((channel) => channel.name);
  const formik = useFormik({
    initialValues: { name: '' },
    onSubmit: (values) => {
      setDisabled(true);
      try {
        validateModal(values.name, namesChannels, t);
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
          dispatch(modalsActions.hideModal());
          setDisabled(false);
          toast.success(t('create channel'), {
            toastId: channel.id,
          });
        });
      } catch (e) {
        setValidationError(e.message);
        setFailedValue(true);
        setDisabled(false);
      }
    },
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onClick={() => dispatch(modalsActions.hideModal())}>
        <Modal.Title>{t('add channel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Modal.Body>
            <Form.Control
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
            <Button type="close" onClick={() => dispatch(modalsActions.hideModal())} variant="secondary" className="btn btn-group-vertical">{t('cancel')}</Button>
            <Button type="submit" disabled={disabled} className="btn btn-group-vertical">{t('send')}</Button>
          </Modal.Footer>
        </Form.Group>
      </Form>
    </Modal>
  );
}

export default modalAddChannel;
