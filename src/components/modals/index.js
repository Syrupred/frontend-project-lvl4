import modalAddChannel from './modalAddChannel.jsx';
import modalRemoveChannel from './modalRemoveChannel.jsx';
import modalRenameChannel from './modalRenameChannel.jsx';

const modals = {
  adding: modalAddChannel,
  removing: modalRemoveChannel,
  renaming: modalRenameChannel,
};

export default (modalName) => modals[modalName];
