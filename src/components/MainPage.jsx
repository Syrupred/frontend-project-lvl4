import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import useAuth from '../hooks/useAuth.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import Channels from './Channels.jsx';
import getModal from './modals/index.js';
import Messages from './Messages.jsx';
import routes from '../routes.js';

function MainPage({ filter }) {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useAuth();
  const navigate = useNavigate();
  const modalType = useSelector((state) => state.modals.type);
  const ComponentModal = getModal(modalType);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.dataPath(), { headers: { Authorization: `Bearer ${auth.user?.token}` } });
        const goodChannels = data.channels.map((channel) => {
          const name = filter.clean(channel.name);
          return { ...channel, name };
        });
        const goodMessages = data.messages.map((message) => {
          const body = filter.clean(message.body);
          return { ...message, body };
        });
        dispatch(channelsActions.addChannels(goodChannels));
        dispatch(messagesActions.addMessages(goodMessages));
      } catch (error) {
        if (error.isAxiosError && error.response.status === 401) {
          navigate(routes.loginPage());
        } else {
          toast.error(t('connection error'));
          rollbar.error('Error fetching data from server, mainpage', error);
        }
      }
    };

    fetchContent();
  }, []);

  return auth.user && (
  <div className="container h-100 my-4 overflow-hidden rounded shadow">
    <div className="row h-100 bg-white flex-md-row">

      <Channels />

      <Messages />

      { modalType && <ComponentModal />}

    </div>
  </div>
  );
}

export default MainPage;
