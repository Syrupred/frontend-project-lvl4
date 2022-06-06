import { Button, Form } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { actions as messagesActions, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import { selectors as channelsSelectors } from '../slices/channelsSlice.js';
import useAppContext from '../hooks/index.jsx';

function Messages() {
  const { t } = useTranslation();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const allMessages = useSelector(messagesSelectors.selectAll);
  const messages = allMessages.filter((message) => message.channelId === currentChannelId);
  const channels = useSelector(channelsSelectors.selectAll);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const chatRef = useRef(null);
  const context = useAppContext();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
    chatRef.current.scrollTo(0, window.innerHeight * messages.length);
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values) => {
      setDisabled(true);
      const { username } = JSON.parse(localStorage.getItem('userId'));
      const msg = { ...values, channelId: currentChannelId, username };
      context.socket.emit('newMessage', msg, (response) => {
        console.log('response', response);
        if (response.status === 'ok') {
          console.log('успешно');
        } else {
          console.log('ошибка');
        }
      });
      context.socket.on('newMessage', (message) => {
        console.log(message);
        dispatch(messagesActions.addOneMessage(message));
        setDisabled(false);
      });

      context.socket.on('disconnect', (reason) => {
        console.log('reason', reason);
      });
      // eslint-disable-next-line no-param-reassign
      values.body = '';
    },
  });
  const nameCurrentChannel = channels.filter((channel) => channel.id === currentChannelId)[0]?.name;

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {nameCurrentChannel}
            </b>
          </p>
          <span className="text-muted">
            {messages.length}
            {t('key', { count: messages.length })}
          </span>
        </div>

        <div id="messages-box" className="chat-messages overflow-auto px-5 " ref={chatRef}>
          {messages && messages.map((message) => (
            <div className="text-break mb-2" key={message.id}>
              <b>{message.username}</b>
              {':   '}
              {message.body}
            </div>
          ))}
        </div>

        <div className="mt-auto px-5 py-3">
          <Form onSubmit={formik.handleSubmit} noValidate className="py-1 border rounded-2">
            <Form.Group className="input-group has-validation">

              <Form.Control
                onChange={formik.handleChange}
                className="border-0 p-0 ps-2 form-control"
                aria-label="Новое сообщение"
                placeholder={t('enter your message')}
                name="body"
                id="body"
                required
                value={formik.values.body}
                autoFocus
                ref={inputRef}
              />
              <Button
                variant="white"
                disabled={(formik.values.body === '') || disabled}
                type="submit"
                className="btn-group-vertical"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
                <span className="visually-hidden">Отправить</span>
              </Button>
            </Form.Group>
          </Form>
        </div>

      </div>
    </div>
  );
}

export default Messages;
