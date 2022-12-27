export function isRelative(dep) {
  return dep.indexOf('..') === 0 || dep.indexOf('.') === 0;
}
