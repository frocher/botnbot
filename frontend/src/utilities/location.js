export function getFullPath(path) {
  const port = window.location.port ? `:${window.location.port}` : '';
  const full = `${window.location.protocol}//${window.location.hostname}${port}`;
  return `${full}/${path}`;
}
