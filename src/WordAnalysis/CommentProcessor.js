// function processWord(comment) {
//   if (comment.author.name != "AutoModerator") {
//       // commentsAnalyzed++;
//       let index = comment.body.indexOf(" "); //spaces are used to differentiate between words
//
//       while (index != -1) {
//         let preProcessedWord = comment.body.substring(0, index);
//         let tempWord = processWord(comment.body.substring(0, index)); //processWord normalizes the word and knocks off any extraneous stuff
//
//         //this loop should ensure that the word is fully processed before continuing
//         while (tempWord != preProcessedWord && tempWord != DO_NOT_PROCESS) {
//           preProcessedWord = tempWord;
//           tempWord = processWord(preProcessedWord);
//         }
//
//         if (tempWord != DO_NOT_PROCESS) { //if the word isn't empty (i.e "")
//           // wordsAnalyzed++;
//           let result = storageMap.get(tempWord);
//           if (result == undefined) { //if not already in map, add it to map
//             storageMap.set(tempWord, 1);
//           }
//           else {
//             storageMap.set(tempWord, result + 1);
//           }
//         }
//
//         comment.body = comment.body.substring(index + 1);
//         index = comment.body.indexOf(" ");
//       }
// }
