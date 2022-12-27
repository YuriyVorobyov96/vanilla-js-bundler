
function* idGenerator() {
  let id = 0;

  while(true) {
    yield id++;
  }
}

function getUser() {
  return {
    id: 0,
    name: getFullName(),
  };
}

function getFullName() {
  return concat(FIRST_NAME, LAST_NAME);
}

const FIRST_NAME = 'First-name';
const LAST_NAME = 'Last-name';

function concat(a, b) {
  return [a, b].join(' ');
}

const idsGenerator = idGenerator();

console.log(idsGenerator.next().value);
console.log("First name:", FIRST_NAME);
console.log(getFullName());