// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  loginPage: () => [host, 'login'].join('/'),
  mainPage: () => [host, host].join('/'),
  signupPage: () => [host, 'signup'].join('/'),
  dataPath: () => [host, prefix, 'data'].join('/'),
  signupPath: () => [host, prefix, 'signup'].join('/'),
  loginPath: () => [host, prefix, 'login'].join('/'),
};
