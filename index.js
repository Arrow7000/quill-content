/**
 * make distinction between frequency map and score map - very diffferent things!
 */


const { getCsv } = require("./csv-load");
const isLetter = require("./is-letter");

function valsToArray(obj) {
  const array = [];
  for (const key in obj) {
    const item = obj[key];
    array.push(item);
  }
  return array;
}

function keysToArray(obj) {
  const array = [];
  for (const key in obj) {
    array.push(key);
  }
  return array;
}

async function getStations() {
  const csv = await getCsv("./stations.csv", true);
  const stations = csv.map(line => line[0]);
  return stations;
}

function getLetters(str) {
  const chars = str.split("");
  const set = new Set();
  const nonSpaceChars = chars.map(char => char.toLowerCase()).filter(isLetter);

  nonSpaceChars.forEach(char => {
    set.add(char);
  });
  return [...set];
}

function getLetterScores(words) {
  const frequencyMap = {};
  for (const word of words) {
    const letters = getLetters(word);
    for (const letter of letters) {
      if (!frequencyMap[letter]) {
        frequencyMap[letter] = 1;
      } else {
        frequencyMap[letter]++;
      }
    }
  }

  return frequencyMap;
}

function getWordScores(words, freqMap) {
  const wordMap = {};
  for (const word of words) {
    const letters = getLetters(word);
    const wordScore = letters.reduce((total, letter) => {
      return total + freqMap[letter];
    }, 0);
    wordMap[word] = wordScore;
  }

  return wordMap;
}

function getHighestScoring(freqMap) {
  let highScore = 0;
  let highWord = "";

  for (const key in freqMap) {
    const score = freqMap[key];
    if (score > highScore) {
      highScore = score;
      highWord = key;
    }
  }
  return highWord;
}

function allAreZero(freqMap) {
  for (const key in freqMap) {
    const score = freqMap[key];
    if (score > 0) return false;
  }
  return true;
}

function objFromList(list, toAssignEach) {
  const obj = {};
  for (const item of list) {
  }
}

function getHighestChain(wordFreqMap, letterFreqMap) {
  // confusion between letter frequency map and stations
  const list = [];
  traverser(wordFreqMap, letterFreqMap);

  return list;

  function traverser(wordFreqMap, letterFreqMap) {
    if (allAreZero(wordFreqMap)) return;

    const highest = getHighestScoring(wordFreqMap);
    list.push(highest);
    const usedLetters = getLetters(highest);
    const usedLettersMap = {};

    for (const letter of usedLetters) {
      usedLettersMap[letter] = 0;
    }

    const wordsArray = keysToArray(wordFreqMap);
    const newLetterFreqMap = { ...letterFreqMap, ...usedLettersMap };
    const newWordFreqMap = getWordScores(wordsArray, newLetterFreqMap);
    traverser(newWordFreqMap, newLetterFreqMap);
  }
}

(async () => {
  const stations = await getStations();
  const freqMap = getLetterScores(stations);
  const wordMap = getWordScores(stations, freqMap);
  const list = getHighestChain(wordMap, freqMap);
  console.log(list);
})();
