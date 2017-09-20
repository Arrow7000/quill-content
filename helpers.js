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

module.exports = { valsToArray, keysToArray };
