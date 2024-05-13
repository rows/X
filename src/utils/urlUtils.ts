export function urlMatchesPatternUrl(url: string, patternURL: string): boolean {
  if (!patternURL) {
    return false;
  }

  const regex = new RegExp('^' + patternURL.replace(/\*/g, '.*') + '$');
  return regex.test(url);
}