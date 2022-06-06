import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      nickname: 'Ваш ник',
      logIn: 'Войти',
      password: 'Пароль',
      'invalid username or password': 'Неверные имя пользователя или пароль',
      'do not have an account?': 'Нет аккаунта?  ',
      registration: 'Регистрация',
      username: 'Имя пользователя',
      confirmPassword: 'Подтвердите пароль',
      'this user already exists': 'Такой пользователь уже существует',
      '3 to 20 characters': 'от 3 до 20 символов',
      'required field': 'Обязательное поле',
      'at least 6 characters': 'Не менее 6 символов',
      'passwords must match': 'Пароли должны совпадать',
      register: 'Зарегистрироваться',
      'page not found': 'Страница не найдена',
      'but you can go': 'Но вы можете перейти',
      'to home page': ' на главную страницу',
      'enter your message': 'Введите сообщение...',
      key_one: ' сообщение',
      key_few: ' сообщения',
      key_many: ' сообщений',
      delete: 'Удалить',
      rename: 'Переименовать',
      channels: 'Каналы',
      'hexlet chat': 'Hexlet Chat',
      logout: 'Выйти',
      'add channel': 'Добавить канал',
      cancel: 'Отменить',
      send: 'Отправить',
      'remove channel': 'Удалить канал',
      sure: 'Уверены?',
      'rename channel': 'Переименовать канал',
      duplication: 'Должно быть уникальным',
      'create channel': 'Канал создан',
      'connection error': 'Ошибка соединения',
      'channel removed': 'Канал удален',
      'channel renamed': 'Канал переименован',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
