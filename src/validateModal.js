import * as yup from 'yup';

const validateModal = (value, channels) => {
  yup.setLocale({
    mixed: {
      required: () => 'notEmpty',
      notOneOf: () => 'duplication',
    },
    string: {
      min: () => 'minLengthValue',
      max: () => 'maxLengthValue',
    },

  });

  const schema = yup
    .string()
    .trim()
    .required()
    .min(3)
    .max(20)
    .notOneOf(channels);

  return schema.validateSync(value, { abortEarly: false });
};

export default validateModal;
