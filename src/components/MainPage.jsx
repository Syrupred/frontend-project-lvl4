import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useAppContext from '../hooks/index.jsx';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import Channels from './Channels.jsx';
import getModal from './modals/index.js';
import Messages from './Messages.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

function MainPage() {
  const dispatch = useDispatch();
  const context = useAppContext();
  const navigate = useNavigate();
  const channels = useSelector(channelsSelectors.selectAll);
  const modalType = useSelector((state) => state.modals.type);
  const ComponentModal = getModal(modalType);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/v1/data', { headers: getAuthHeader() });
        context.logIn();
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

  return channels.length > 0 && (
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
