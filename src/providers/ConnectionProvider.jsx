import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { ConnectionContext } from '../contexts/index.jsx';
import { actions as modalsActions } from '../slices/modalsSlice.js';

function ConnectionProvider({ children, socket, filter }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const addNewChannel = (values) => {
    socket.emit('newChannel', values);
  };
  const removeChannel = (id) => {
    socket.emit('removeChannel', id);
  };
  const renameChannel = (channel) => {
    socket.emit('renameChannel', channel);
  };
  const addNewMessage = (msg) => {
    socket.emit('newMessage', msg);
  };

  socket.on('newChannel', (channel) => {
    const name = filter.clean(channel.name);
    dispatch(channelsActions.addOneChannel({ ...channel, name }));
    dispatch(channelsActions.setCurrentChannelId(channel.id));
    dispatch(modalsActions.hideModal());
    toast.success(t('create channel'));
  });
  socket.on('disconnect', () => {
    toast.error(t('connection error'));
  });

  socket.on('removeChannel', (channel) => {
    dispatch(channelsActions.removeChannel(channel.id));
    dispatch(channelsActions.setCurrentChannelId(1));
    dispatch(modalsActions.hideModal());
    toast.success(t('channel removed'));
  });
  socket.on('renameChannel', (channel) => {
    const name = filter.clean(channel.name);
    dispatch(channelsActions.renameChannel({
      id: channel.id,
      changes: {
        name,
      },
    }));
    dispatch(modalsActions.hideModal());
    toast.success(t('channel renamed'));
  });
  socket.on('newMessage', (message) => {
    const body = filter.clean(message.body);
    dispatch(messagesActions.addOneMessage({ ...message, body }));
  });

  const context = useMemo(() => ({
    addNewChannel, removeChannel, renameChannel, addNewMessage,
  }), [addNewChannel, removeChannel, renameChannel, addNewMessage]);
  return (
    <ConnectionContext.Provider value={context}>
      { children }
    </ConnectionContext.Provider>
  );
}

export default ConnectionProvider;
