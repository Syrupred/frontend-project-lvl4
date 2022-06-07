/* eslint-disable no-param-reassign */
import filter from 'leo-profanity';

filter.add(filter.getDictionary('ru'));

const filterBadWords = (word) => {
  if (filter.list().includes(word)) {
    word = '***';
  }
  return word;
};

export default filterBadWords;
