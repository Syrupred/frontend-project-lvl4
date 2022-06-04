import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAppContext from '../hooks/index.jsx';
import img from '../images/login.png';

function LoginPage() {
  const context = useAppContext();
  const [authFailed, setAuthFailed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setDisabled(true);
      setAuthFailed(false);

      try {
        const res = await axios.post('/api/v1/login', values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        context.logIn();
        navigate('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          setDisabled(false);
          return;
        }
        throw err;
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img className="rounded-circle" alt="Войти" src={img} />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0" noValidate>
                <h1 className="text-center mb-4">Войти</h1>
                <Form.Group className="form-floating mb-3">

                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    onBlur={formik.handleBlur}
                    placeholder="username"
                    className="form-input"
                    name="username"
                    id="username"
                    autoComplete="username"
                    isInvalid={authFailed}
                    required
                    ref={inputRef}
                  />
                  <Form.Label htmlFor="username">Ваш ник</Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-3">

                  <Form.Control
                    type="password"
                    onBlur={formik.handleBlur}
                    className="form-input"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    isInvalid={authFailed}
                    required
                  />
                  <Form.Label htmlFor="password">Пароль</Form.Label>
                  <Form.Control.Feedback type="invalid">Неверные имя пользователя или пароль</Form.Control.Feedback>
                </Form.Group>
                <Button disabled={disabled} type="submit" variant="outline-primary" className="w-100 btn btn-outline-primary">Войти</Button>
              </Form>

            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?  </span>
                <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
