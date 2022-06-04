// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';
import React from 'react';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './components/App.jsx';
import store from './slices/index.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

document.body.classList.add('bg-light');
const div = document.querySelector('div');
div.classList.remove('container-lg');
div.classList.remove('p-3');

const mountNode = document.getElementById('chat');
const root = ReactDOM.createRoot(mountNode);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
