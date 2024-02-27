export function urlMatchesPatternUrl(url: string, patternURL: string) {
  if (!patternURL) {
    return false;
  }
  // @ts-ignore
  const pattern = new URLPattern(patternURL);

  return pattern.test(url);
}
