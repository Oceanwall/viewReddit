import { DO_NOT_PROCESS } from './WordAnalysisConstants.js';
import { isCommon, isContraction, checkChar } from './WordProcessorFunctions.js';

//Recursive function to process the word (from both ends).
function processWord(targetWord) {

  //begin by setting the word to lowercase
  let tempWord = targetWord.toLowerCase();

  //if the word is either empty OR a common word OR a contraction, then do not process it
  if (tempWord === "" || isCommon(tempWord) || isContraction(tempWord) || checkChar(tempWord)) {
    return DO_NOT_PROCESS;
  }

  //checks first and last characters of the word to see if they are extraneous or not
  //won't error because previous if statement guarantees that this has at least one character in it
  let badEnd = checkChar(tempWord.substring(tempWord.length - 1));
  let badStart = checkChar(tempWord.substring(0, 1));

  if (badEnd && badStart) {
    return processWord(tempWord.substring(1, tempWord.length - 1));
  }
  else if (badEnd) {
    return processWord(tempWord.substring(0, tempWord.length - 1));
  }
  else if (badStart) {
    return processWord(tempWord.substring(1));
  }
  else return tempWord;
}

export { processWord };
