function escapeRegex(str: string) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export const convertToFuzzyRegex = (str: string) => {
  if (!str) return /.*/i;

  let fuzzyString = '';
  str.split('').forEach((c) => (fuzzyString += escapeRegex(c) + '.*'));

  return new RegExp(fuzzyString, 'i');
};
