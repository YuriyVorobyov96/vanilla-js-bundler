import { dirname, join, resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { isRelative } from './utils.js';
import REGEXP from './regexp.js';

export default class Bundler {
  #root;
  #entryPoint;
  #files;
  #queue;
  #dependenciesMap;
  #filesContent;
  #fullCode;
  #output;

  constructor({
    path,
    entryPoint,
    output = 'out.bundle.js',
  }) {
    this.#root = path;
    this.#entryPoint = join(this.#root, entryPoint);
    this.#files = new Set();
    this.#queue = [this.#entryPoint];
    this.#dependenciesMap = {};
    this.#filesContent = [];
    this.#fullCode = '';
    this.#output = output;
  }

  async process() {
    await this.#processFiles();
    await this.#mergeFiles();
    await this.#createBundle();
  }

  async #processFiles() {
    while (this.#queue.length) {
      const file = this.#queue.shift(); 
    
      if (this.#isFileProcessed(file)) {
        continue;
      }

      const content = await readFile(file, 'utf8');

      const fileDependencies = this.#getFileDependencies(file, content);

      this.#files.add(file);

      this.#queue.push(...Object.values(fileDependencies));

      await this.#buildDependenciesMap(fileDependencies);
    }
  }

  async #mergeFiles() {
    await Promise.all(Array.from(this.#files).reverse().map(async file => {
      const dep = Object.values(this.#dependenciesMap).find(dep => dep.fpath == file);

      let code = dep?.code;

      if (!code) {
        code = await readFile(file, 'utf8');
      }

      code = this.#cleanCode(code, dep);

      this.#filesContent.push(code);
    }));

    this.#fullCode = this.#cleanCode(this.#filesContent.join("\n"), '');
  }

  async #createBundle() {
    return writeFile(this.#output, this.#fullCode);
  }

  #cleanCode(code, dependency) {
    let matches = null
    let content = code;

    do {
      matches = REGEXP.import.exec(code);
      if (matches != null) {
        if (this.#files.has(matches[1])) {
          content = content.replace(matches[0], '');
        } else {
          content = content.replace(matches[0], this.#dependenciesMap[matches[1]].code);
          this.#files.add(matches[1]);
        }
      }
      else {
        let key = dependency?.depName;

        if (this.#files.has(key)) {
          content = '';
        }
      }
    } while(matches != null)

    content = content.replace(REGEXP.newLine, '\n');

    return content;
  }

  #isFileProcessed(file) {
    return this.#files.has(file);
  }

  #getFileDependencies(file, content) {
    return [...content.matchAll(REGEXP.dependency)].reduce((list, dep) => {
      if (isRelative(dep[0])) {
        list[dep[0]] = (resolve(dirname(file), dep[0]));
  
        return list;
      }
  
      list[dep[0]] = (resolve(this.#root, dep[0]));
  
      return list;
    }, {});
  }

  async #buildDependenciesMap(fileDependencies) {
    return Promise.all(Object.keys(fileDependencies).map(async dep => {
      const fullFilePath = fileDependencies[dep];
      const code = await readFile(fullFilePath, 'utf8');
      
      const content = this.#processDependency(code);
  
      this.#dependenciesMap[dep] = {
        fpath: fullFilePath,
        depName: dep,
        code: content,
      };
    }));
  }

  #processDependency(code) {
    let content = code;
  
    let exportMatcher = REGEXP.export;
    let match = null;

    do {
      match = exportMatcher.exec(code);

      if (match) { 
        content = content.replace(match[0], '');
      }

    } while(match != null)

    return content;
  }
}
