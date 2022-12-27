import { concat } from './utils.js';
import { FIRST_NAME, LAST_NAME } from './const.js';

export function* idGenerator() {
  let id = 0;

  while(true) {
    yield id++;
  }
}

export function getUser() {
  return {
    id: 0,
    name: getFullName(),
  };
}

export function getFullName() {
  return concat(FIRST_NAME, LAST_NAME);
}
