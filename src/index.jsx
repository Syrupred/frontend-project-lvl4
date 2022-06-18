// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import Init from './Init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

document.body.classList.add('bg-light');
const div = document.querySelector('div');
div.classList.remove('container-lg');
div.classList.remove('p-3');

const runUp = async () => {
  const socket = io();
  const vdom = await Init(socket);
  const mountNode = document.getElementById('chat');
  const root = ReactDOM.createRoot(mountNode);
  root.render(
    vdom,
  );
};
runUp();
