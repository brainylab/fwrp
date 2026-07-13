const PATH_PATTERN = /^(\/)?([a-zA-Z\d_.-]+\/)*([a-zA-Z\d_.-]+)?(\?[^#]*)?$/;

export function isValidPath(url: string): boolean {
  return PATH_PATTERN.test(url);
}
