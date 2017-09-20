const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

async function getCsv(path, hasColNames = false) {
  const fileStr = await readFile(path, "utf8");
  const firstLine = hasColNames ? 1 : 0;
  const array = fileStr
    .split("\n")
    .slice(firstLine)
    .filter(line => line !== "")
    .map(line => line.split(","));
  return array;
}

module.exports = { getCsv };
