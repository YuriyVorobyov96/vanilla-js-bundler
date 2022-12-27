import { argv } from 'node:process';
import Bundler from './src/bundler.js';

const bundler = new Bundler({
  path: argv[2],
  entryPoint: argv[3],
});

await bundler.process();
