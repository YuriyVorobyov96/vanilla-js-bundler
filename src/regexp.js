const REGEXP = {
  dependency: /(?<=from ')\..*?\.js(?=';?)/gm,
  import: /.*import[ ]+.+[ ]+from[ ]+'([\d\w_\.\/]+)';?/g,
  export: /(export) /gi,
  newLine: /^\n{2,}/gm,
};

export default REGEXP;
