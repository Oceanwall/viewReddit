// function processWord(targetWord) {
//
//   let tempWord = targetWord.toLowerCase(); //begin by setting the word to lowercase
//
//   if (tempWord == "" || isCommon(tempWord) || isContraction(tempWord) || !checkChar(tempWord)) { //if the word is either empty OR a common word OR a contraction, then do not process it
//     return DO_NOT_PROCESS;
//   }
//
//   //checks first and last characters of the word to see if they are extraneous or not
//   let OKend = checkChar(tempWord.substring(tempWord.length - 1));
//   let OKstart = checkChar(tempWord.substring(0, 1)); //won't error because previous if statement guarantees that this has at least one character in it
//
//   if (OKstart && OKend) { //if both the first and last chars are ok, return the word as is
//     return tempWord;
//   }
//   else if (OKstart && !OKend) { //last character doesn't work, fix, check, and return
//     return tempWord.substring(0, tempWord.length - 1);
//   }
//   else if (OKend && !OKstart) { //first character doesn't work, fix, check, and return
//     return tempWord.substring(1);
//   }
//   else { //both first and last characters don't work, fix, check, and return
//     return tempWord.substring(1, tempWord.length - 1);
//   }
// }
