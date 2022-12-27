import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Bundler from './src/bundler.js'

const path = join(dirname(fileURLToPath(import.meta.url)), 'example');
const entryPoint = 'index.js';

console.log(path, entryPoint)

const bundler = new Bundler({
  path,
  entryPoint,
});

await bundler.process();
