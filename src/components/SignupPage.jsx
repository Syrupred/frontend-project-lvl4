import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useAppContext from '../hooks/index.jsx';
import img from '../images/signup.png';

function SignupPage() {
  const context = useAppContext();
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();
  const [login, setAvailabilityLogin] = useState(false);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'имя пользователя от 3 до 20 символов')
        .max(20, 'имя пользователя от 3 до 20 символов')
        .required('обязательное поле'),
      password: Yup.string()
        .min(6, 'не менее 6 символов')
        .required('обязательное поле'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'пароли должны совпадать')
        .required('обязательное поле'),
    }),
    onSubmit: async (values) => {
      setDisabled(true);

      try {
        const res = await axios.post('/api/v1/signup', values);
        console.log(res.data);
        localStorage.setItem('userId', JSON.stringify(res.data));
        context.logIn();
        navigate('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
          setDisabled(false);
          setAvailabilityLogin(true);
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
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img src={img} className="rounded-circle" alt="Регистрация" />
              </div>
              <Form onSubmit={formik.handleSubmit} className="p-3" noValidate>
                <h1 className="text-center mb-4">Регистрация</h1>
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
                    required
                    ref={inputRef}
                    isInvalid={login || (formik.touched.username && formik.errors.username)}

                  />
                  <Form.Label className="form-label" htmlFor="username">Имя пользователя</Form.Label>
                  {formik.touched.username && formik.errors.username ? (
                    <Form.Control.Feedback tooltip type="invalid">{formik.errors.username}</Form.Control.Feedback>

                  ) : null}
                </Form.Group>
                <Form.Group className="form-floating mb-3">

                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    placeholder="password"
                    name="password"
                    id="password"
                    isInvalid={login || (formik.touched.password && formik.errors.password)}
                    required

                  />
                  <Form.Label htmlFor="password">Пароль</Form.Label>
                  {formik.touched.password && formik.errors.password ? (
                    <Form.Control.Feedback tooltip type="invalid">{formik.errors.password}</Form.Control.Feedback>
                  ) : null}
                </Form.Group>
                <Form.Group className="form-floating mb-3">

                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur}
                    placeholder="confirmPassword"
                    name="confirmPassword"
                    id="confirmPassword"
                    isInvalid={login
                             || (formik.touched.confirmPassword && formik.errors.confirmPassword)}
                    required

                  />
                  <Form.Label htmlFor="confirmPassword">Подтвердите пароль</Form.Label>

                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <Form.Control.Feedback tooltip type="invalid">
                      {formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                  ) : null}
                  { login ? (

                    <Form.Control.Feedback tooltip type="invalid">
                      Такой пользователь уже существует
                    </Form.Control.Feedback>

                  ) : null}
                </Form.Group>

                <Button disabled={disabled} type="submit" variant="outline-primary" className="w-100 btn btn-outline-primary">Зарегистрироваться</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
