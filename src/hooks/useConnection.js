import { useContext } from 'react';

import { ConnectionContext } from '../contexts/index.jsx';

const useConnection = () => useContext(ConnectionContext);

export default useConnection;
