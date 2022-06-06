import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { Button, Navbar, Container } from 'react-bootstrap';
import AppContext from '../contexts/index.jsx';
import LoginPage from './LoginPage.jsx';
import NoMatch from './NoMatch.jsx';
import MainPage from './MainPage.jsx';
import SignupPage from './SignupPage.jsx';
import useAppContext from '../hooks/index.jsx';

function AppProvider({ children }) {
  const socket = io();
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };
  const context = useMemo(() => ({
    loggedIn, logIn, logOut, socket,
  }), [loggedIn]);
  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
}

function AuthButton({ t }) {
  const context = useAppContext();

  return (
    context.loggedIn
      ? <Button onClick={context.logOut} as={Link} to="/login">{t('logout')}</Button>
      : null
  );
}

function App() {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column h-100">
      <AppProvider>
        <Router>

          <Navbar bg="white" expand="lg" className="shadow-sm">
            <Container>
              <Navbar.Brand as={Link} to="/">{t('hexlet chat')}</Navbar.Brand>
              <AuthButton t={t} />
            </Container>

          </Navbar>

          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>

          <ToastContainer />

        </Router>
      </AppProvider>
    </div>
  );
}

export default App;
