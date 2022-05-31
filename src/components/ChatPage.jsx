import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { io } from 'socket.io-client';
import useAuth from '../hooks/index.jsx';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as messagesActions, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import getModal from './modals/index.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const renderModal = ({ modalInfo, hideModal, changeIdOpenedMenu }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return (
    <Component
      onHide={hideModal}
      modalInfo={modalInfo}
      changeIdOpenedMenu={changeIdOpenedMenu}
    />
  );
};

function ChatPage() {
  const [idOpenedMenu, changeIdOpenedMenu] = useState();
  const socket = io();
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const dispatch = useDispatch();
  const allMessages = useSelector(messagesSelectors.selectAll);
  const messages = allMessages.filter((message) => message.channelId === currentChannelId);
  const auth = useAuth();
  const navigate = useNavigate();

  const [modalInfo, setModalInfo] = useState({ type: null, id: null });
  const hideModal = () => setModalInfo({ type: null, id: null });
  const showModal = (type, id = null) => setModalInfo({ type, id });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/v1/data', { headers: getAuthHeader() });
        auth.logIn();
        dispatch(channelsActions.addChannels(data.channels));
        dispatch(messagesActions.addMessages(data.messages));
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          navigate('/login');
          return;
        }
        throw err;
      }
    };

    fetchContent();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values) => {
      const { username } = JSON.parse(localStorage.getItem('userId'));
      const msg = { ...values, channelId: currentChannelId, username };
      socket.emit('newMessage', msg, (response) => {
        if (response.status === 'ok') {
          console.log('успешно');
        } else {
          console.log('ошибка');
        }
      });
    },
  });
  const nameCurrentChannel = channels.filter((channel) => channel.id === currentChannelId)[0]?.name;

  socket.on('newMessage', (msg) => {
    console.log(msg);
    dispatch(messagesActions.addOneMessage(msg));
  });

  socket.on('disconnect', (reason) => {
    console.log(reason);
  });

  const selectChannel = (channelId) => () => {
    changeIdOpenedMenu();
    dispatch(channelsActions.setCurrentChannelId(channelId));
  };

  return auth.loggedIn && (
  <div className="container h-100 my-4 overflow-hidden rounded shadow">
    <div className="row h-100 bg-white flex-md-row">

      <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
        <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
          <span>Каналы</span>
          <Button onClick={() => showModal('adding')} type="button" className="p-0 text-primary btn btn-group-vertical">
            <span className="visually-hidden">+</span>
          </Button>
        </div>
        <ul className="nav flex-column nav-pills nav-fill px-2">
          {channels && channels.map((channel) => (
            <li key={channel.id} className="nav-item w-100">
              <div role="group" className="d-flex show dropdown btn-group">
                <Button onClick={selectChannel(channel.id)} variant={channel.id === currentChannelId ? 'info' : 'light'} type="button" className="w-100 rounded-0 text-start btn">
                  <span className="me-1">#</span>
                  {channel.name}
                </Button>
                {channel.removable && (
                  <Button onClick={() => changeIdOpenedMenu(channel.id)} variant={channel.id === currentChannelId ? 'info' : 'light'} type="button" aria-expanded="true" className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn">
                    <span className="visually-hidden">Управление каналом</span>
                  </Button>
                )}
                {idOpenedMenu === channel.id && (

                <div
                  x-placement="bottom-start"
                  className="dropdown-menu show"
                  data-popper-reference-hidden="false"
                  data-popper-escaped="false"
                  data-popper-placement="bottom-start"
                  style={{ position: 'absolute', inset: '0px auto auto 0px', transform: 'translate3d(73px, 40px, 0px)' }}
                >
                  <Button onClick={() => showModal('removing', channel.id)} data-rr-ui-dropdown-item className="dropdown-item" role="button" tabIndex="0">Удалить</Button>
                  <Button onClick={() => showModal('renaming', channel.id)} data-rr-ui-dropdown-item className="dropdown-item" role="button" tabIndex="0">Переименовать</Button>
                </div>
                )}
              </div>
            </li>
          ))}

        </ul>
      </div>

      <div className="col p-0 h-100">
        <div className="d-flex flex-column h-100">
          <div className="bg-light mb-4 p-3 shadow-sm small">
            <p className="m-0">
              <b>
                #
                {nameCurrentChannel}
              </b>
            </p>
            <span className="text-muted">432 сообщения</span>
          </div>

          <div id="messages-box" className="chat-messages overflow-auto px-5 ">
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
                  placeholder="Введите сообщение..."
                  name="body"
                  id="body"
                  required
                  value={formik.values.body}
                  autoFocus
                />
                <Button type="submit" className="btn btn-group-vertical"><span className="visually-hidden">Отправить</span></Button>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>

    </div>
    {renderModal({ modalInfo, hideModal, changeIdOpenedMenu })}
  </div>
  );
}

export default ChatPage;
