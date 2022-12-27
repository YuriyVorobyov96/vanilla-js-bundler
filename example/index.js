import { FIRST_NAME, LAST_NAME } from './const.js';
import { idGenerator, getFullName } from './service.js';

const idsGenerator = idGenerator();

console.log(idsGenerator.next().value);
console.log("First name:", FIRST_NAME);
console.log(getFullName());