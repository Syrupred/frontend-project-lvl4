import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

import { Button, Navbar, Container } from 'react-bootstrap';
import LoginPage from './LoginPage.jsx';
import NoMatch from './NoMatch.jsx';
import MainPage from './MainPage.jsx';
import SignupPage from './SignupPage.jsx';
import useAuth from '../hooks/useAuth.js';
import routes from '../routes.js';

function AuthButton({ t }) {
  const auth = useAuth();

  return (
    auth.user
      ? <Button onClick={auth.logOut} as={Link} to={routes.loginPage()}>{t('logout')}</Button>
      : null
  );
}

function App({ filter }) {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column h-100">
      <Router>

        <Navbar bg="white" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to={routes.mainPage()}>{t('hexlet chat')}</Navbar.Brand>
            <AuthButton t={t} />
          </Container>
        </Navbar>

        <Routes>
          <Route path={routes.mainPage()} element={<MainPage filter={filter} />} />
          <Route path={routes.loginPage()} element={<LoginPage />} />
          <Route path={routes.signupPage()} element={<SignupPage />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>

        <ToastContainer />

      </Router>
    </div>
  );
}

export default App;
