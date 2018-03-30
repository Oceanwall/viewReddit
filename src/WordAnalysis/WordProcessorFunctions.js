import { COMMON_WORDS, EXTRANEOUS, NUMBERS } from './WordAnalysisConstants.js';

//Returns true if a word is common, false if it's not
function isCommon(word) {
  for (let i = 0; i < COMMON_WORDS.length; i++) {
    if (COMMON_WORDS[i] === word)
      return true;
  }
  return false;
}

//Returns true if a word is a contraction, false if it's not
function isContraction(word) {
  return word.indexOf("'") !== -1 || word.indexOf("’") !== -1; //checks for presence of apostrophes; if any exist, then word is assumed to be contraction
}

//Returns true if a word is extraneous, false if it's not
//NOTE: Fix use of Numbers? or add to main array? hmm
function checkChar(char) {
  return EXTRANEOUS.indexOf(char) !== -1 || NUMBERS.indexOf(char) !== -1;
}

export { isCommon, isContraction, checkChar };
