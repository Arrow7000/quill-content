const letters = "abcdefghijklmnopqrstuvwxyz".split("");
const map = {};

for (const letter of letters) {
  map[letter] = true;
}

const isLetter = letter => map[letter];

module.exports = isLetter;
