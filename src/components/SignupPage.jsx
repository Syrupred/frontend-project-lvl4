import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import useAuth from '../hooks/useAuth.js';
import img from '../images/signup.png';
import routes from '../routes.js';

function SignupPage() {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const auth = useAuth();
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
        .min(3, t('3 to 20 characters'))
        .max(20, t('3 to 20 characters'))
        .required(t('required field')),
      password: Yup.string()
        .min(6, t('at least 6 characters'))
        .required(t('required field')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], t('passwords must match'))
        .required(t('required field')),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(routes.signupPath(), values);
        auth.logIn(res.data);
        navigate(routes.mainPage());
      } catch (error) {
        if (error.isAxiosError && error.response.status === 409) {
          setAvailabilityLogin(true);
        } else {
          toast.error(t('connection error'));
          rollbar.error('Error fetching data from server, signuppage', error);
        }
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
                <h1 className="text-center mb-4">{t('registration')}</h1>
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
                  <Form.Label className="form-label" htmlFor="username">{t('username')}</Form.Label>
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
                  <Form.Label htmlFor="password">{t('password')}</Form.Label>
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
                  <Form.Label htmlFor="confirmPassword">{t('confirmPassword')}</Form.Label>

                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <Form.Control.Feedback tooltip type="invalid">
                      {formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                  ) : null}
                  { login ? (

                    <Form.Control.Feedback tooltip type="invalid">
                      {t('this user already exists')}
                    </Form.Control.Feedback>

                  ) : null}
                </Form.Group>

                <Button type="submit" variant="outline-primary" className="w-100 btn btn-outline-primary">{t('register')}</Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
