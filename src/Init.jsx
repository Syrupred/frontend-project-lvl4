/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider } from '@rollbar/react';
import { initReactI18next } from 'react-i18next';
import { io } from 'socket.io-client';
import filter from 'leo-profanity';
import i18n from 'i18next';
import ru from './locales/ru.js';
import App from './components/App.jsx';
import channelsReducer from './slices/channelsSlice.js';
import messagesReducer from './slices/messagesSlice.js';
import modalsReducer from './slices/modalsSlice.js';
import AuthProvider from './providers/AuthProvider.jsx';
import ConnectionProvider from './providers/ConnectionProvider.jsx';

const Init = async () => {
  const store = configureStore({
    reducer: {
      channels: channelsReducer,
      messages: messagesReducer,
      modals: modalsReducer,
    },
  });

  await i18n
    .use(initReactI18next)
    .init({
      resources: { ru },
      lng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  const socket = io();

  const rollbarToken = process.env.ROLLBAR_TOKEN;
  const rollbarConfig = {
    accessToken: rollbarToken,
    environment: 'production',
  };

  filter.add(filter.getDictionary('ru'));

  return (
    <Provider store={store}>
      <RollbarProvider config={rollbarConfig}>
        <ConnectionProvider socket={socket} filter={filter}>
          <AuthProvider>
            <App filter={filter} />
          </AuthProvider>
        </ConnectionProvider>
      </RollbarProvider>
    </Provider>
  );
};

export default Init;
