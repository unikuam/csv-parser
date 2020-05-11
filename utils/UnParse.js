const fs = require('fs');
const readline = require('readline');
const {
  parseObjectToCSV
} = require('./utility');

function Unparse(file) {
  let fileStream;
  try {
    fileStream = fs.createReadStream(file);
  } catch (error) {
    throw Error('file path not valid');
  }

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  async function toCsv() {
    let objectString = "";
    let syntaxQueue = [];
    let csv = "";
    for await (const line of rl) {
      if (line.indexOf("[") !== -1) {
        if (syntaxQueue.length > 1) {
          throw Error('Invalid json for csv conversion.');
        }
        syntaxQueue.push('[')
      } else if (line.indexOf("{") !== -1) {
        objectString += "{";
        syntaxQueue.push('{');
      } else if (line.indexOf("}") !== -1) {
        if (syntaxQueue[syntaxQueue.length - 1] === "{") {
          objectString += "}";
          syntaxQueue.pop();
        } else {
          throw Error('Not a valid json');
        }
      } else if (line.indexOf("]") !== -1) {
        if (syntaxQueue[syntaxQueue.length - 1] === "[") {
          syntaxQueue.pop();
        } else {
          throw Error('Not a valid json');
        }
      } else {
        objectString = objectString + line.trim();
      }

      if (syntaxQueue.length === 1 && syntaxQueue[0] === "[" && objectString !== "") {
        const object = JSON.parse(objectString);
        csv = csv + parseObjectToCSV(object) + "\n";
        objectString = "";
      }

    }
    return csv;
  }

  return {
    toCsv
  }

}

const csvUnparse = async function(file) {
  if (arguments.length < 1) {
    throw new Error(`Expected at least one parameter which should be a file path, found ${arguments.length}`);
  }
  const unparseObj = new Unparse(file);
  const result = unparseObj.toCsv();
  return result;
}

module.exports = {
  csvUnparse
}
