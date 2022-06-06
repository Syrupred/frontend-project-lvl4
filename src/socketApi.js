import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import i18n from './i18n.js';

const socket = io();

socket.on('disconnect', (reason) => {
  console.log('reason', reason);
  toast.error(i18n.t('connection error'));
});

export default socket;
