import React, { useState, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { io } from 'socket.io-client';
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

function AuthButton() {
  const context = useAppContext();

  return (
    context.loggedIn
      ? <Button onClick={context.logOut} as={Link} to="/login">Выйти</Button>
      : null
  );
}

function App() {
  return (
    <div className="d-flex flex-column h-100">
      <AppProvider>
        <Router>

          <Navbar bg="white" expand="lg" className="shadow-sm">
            <Container>
              <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
              <AuthButton />
            </Container>

          </Navbar>

          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>

        </Router>
      </AppProvider>
    </div>
  );
}

export default App;
