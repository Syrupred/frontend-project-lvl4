import { useContext } from 'react';

import appContext from '../contexts/index.jsx';

const useAppContext = () => useContext(appContext);

export default useAppContext;
