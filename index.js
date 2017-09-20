const { resolve } = require("path");
const { getCsv } = require("./csv-load");
const isLetter = require("./is-letter");
const { valsToArray, keysToArray } = require("./helpers");

const filename = "stations.csv";

async function getStationsFromCsvArray() {
  const filePath = resolve(__dirname, filename);
  const csv = await getCsv(filePath, true);
  const stations = csv.map(line => line[0]); // station names are in first column of CSV
  return stations;
}

function getLetters(str) {
  const chars = str.split("");
  const set = new Set();
  const nonSpaceChars = chars.map(char => char.toLowerCase()).filter(isLetter);

  nonSpaceChars.forEach(char => set.add(char));
  return [...set];
}

function getFrequencyMap(words) {
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

function getLetterScores(words) {
  const freqMap = getFrequencyMap(words);
  const scoreMap = {};

  for (const key in freqMap) {
    const freqScore = freqMap[key];
    scoreMap[key] = 1 / freqScore;
  }

  return scoreMap;
}

function getWordScores(words, letterScoreMap) {
  const wordMap = {};
  for (const word of words) {
    const letters = getLetters(word);
    const wordScore = letters.reduce((total, letter) => {
      return total + letterScoreMap[letter];
    }, 0);
    wordMap[word] = wordScore;
  }

  return wordMap;
}

function getHighestScoring(scoreMap) {
  let highScore = 0;
  let highWord = "";

  for (const key in scoreMap) {
    const score = scoreMap[key];
    if (score > highScore) {
      highScore = score;
      highWord = key;
    }
  }
  return highWord;
}

function allAreZero(scoreMap) {
  for (const key in scoreMap) {
    const score = scoreMap[key];
    if (score > 0) return false;
  }
  return true;
}

function objFromList(list, toAssignEach) {
  const obj = {};
  for (const item of list) {
  }
}

function getHighestChain(wordScoreMap, letterScoreMap) {
  const list = [];
  traverser(wordScoreMap, letterScoreMap);

  return list;

  function traverser(wordScoreMap, letterScoreMap) {
    if (allAreZero(wordScoreMap)) return;

    const highest = getHighestScoring(wordScoreMap);
    list.push(highest);
    const usedLetters = getLetters(highest);
    const usedLettersMap = {};

    for (const letter of usedLetters) {
      usedLettersMap[letter] = 0;
    }

    const wordsArray = keysToArray(wordScoreMap);
    const newLetterScoreMap = { ...letterScoreMap, ...usedLettersMap };
    const newWordScoreMap = getWordScores(wordsArray, newLetterScoreMap);
    traverser(newWordScoreMap, newLetterScoreMap);
  }
}

(async () => {
  const stations = await getStationsFromCsvArray();
  const letterScoreMap = getLetterScores(stations);
  const wordScoreMap = getWordScores(stations, letterScoreMap);
  const list = getHighestChain(wordScoreMap, letterScoreMap);
  console.log(list);
})();
