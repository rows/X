export function urlMatchesPatternUrl(url: string, patternURL: string) {
  if (!patternURL) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const pattern = new URLPattern(patternURL);

  return pattern.test(url);
}
