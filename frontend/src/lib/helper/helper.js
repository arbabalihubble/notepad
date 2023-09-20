export const getWordCharacterCount = (str) => {
  if (typeof str !== 'string') {
    return {
      words: 0,
      characters: 0
    };
  }
  const stringWithoutHTML = str.replace(/<\/?[^>]+(>|$)/g, '');
  let words = stringWithoutHTML.split(/[ \t\n\r!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+/);
  words = words.filter((word) => {
    if (word !== '') {
      return word;
    }
  });
  const wordCount = words.length;
  const characterCount = words.join('').length;
  return {
    words: wordCount,
    characters: characterCount
  }
};