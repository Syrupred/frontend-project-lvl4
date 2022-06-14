import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import filterBadWords from '../../filterBadWords.js';
import { actions as channelsActions, selectors as channelsSelectors } from '../../slices/channelsSlice.js';
import validateModal from '../../validateModal.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import socket from '../../socketApi.js';

function modalRenameChannel() {
  const { t } = useTranslation();
  const [failedValue, setFailedValue] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const idChannel = useSelector((state) => state.modals.id);
  const channels = useSelector(channelsSelectors.selectAll);
  const namesChannels = channels.map((channel) => channel.name);
  const { name: nameCurrentChannel } = channels.filter(({ id }) => id === idChannel)[0];
  const formik = useFormik({
    initialValues: { name: nameCurrentChannel },
    onSubmit: (values) => {
      setDisabled(true);
      try {
        validateModal(values.name, namesChannels, t);
        socket.emit('renameChannel', { id: idChannel, name: values.name });

        socket.on('renameChannel', (channel) => {
          const name = filterBadWords(channel.name);
          setDisabled(false);
          dispatch(channelsActions.renameChannel({
            id: channel.id,
            changes: {
              name,
            },
          }));
          dispatch(modalsActions.hideModal());
          toast.success(t('channel renamed'), {
            toastId: channel.id,
          });
        });
      } catch (e) {
        setDisabled(false);
        setValidationError(e.message);
        setFailedValue(true);
      }
    },
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show centered>
      <Modal.Header closeButton onClick={() => dispatch(modalsActions.hideModal())}>
        <Modal.Title>{t('rename channel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group>
          <Modal.Body>
            <Form.Control
              id="name"
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
              isInvalid={failedValue}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  formik.handleSubmit();
                }
              }}
            />
            <Form.Label className="visually-hidden" htmlFor="name">Имя канала</Form.Label>
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

export default modalRenameChannel;
