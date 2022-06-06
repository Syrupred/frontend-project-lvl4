import * as yup from 'yup';

const validateModal = (value, channels, t) => {
  yup.setLocale({
    mixed: {
      required: () => t('required field'),
      notOneOf: () => t('duplication'),
    },
    string: {
      min: () => t('3 to 20 characters'),
      max: () => t('3 to 20 characters'),
    },

  });

  const schema = yup
    .string()
    .trim()
    .required()
    .min(3)
    .max(20)
    .notOneOf(channels);

  return schema.validateSync(value);
};

export default validateModal;
