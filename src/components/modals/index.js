import ModalAddChannel from './ModalAddChannel.jsx';
import ModalRemoveChannel from './ModalRemoveChannel.jsx';
import ModalRenameChannel from './ModalRenameChannel.jsx';

const modals = {
  adding: ModalAddChannel,
  removing: ModalRemoveChannel,
  renaming: ModalRenameChannel,
};

export default (modalName) => modals[modalName];
