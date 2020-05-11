const fs = require('fs');
const readline = require('readline');
const request = require('request');
const {
  splitInputLine,
  isComment
} = require('./utility')

function Parse(file, {
  separators = null,
  abortOnError = false,
  isRemoteUrl = false,
  customHeader = null,
  ignoreHeader = false
}) {
  let rl;

  if (isRemoteUrl) {
    if (!isValidRemoteURL(isRemoteUrl)) throw new Error('Invalid URL passed.');
    rl = readline.createInterface({
      input: request.get(file).on('error', (err) => {
        throw new Error(err);
      }),
    });
  } else {
    if (!fs.existsSync(file)) throw new Error('No file found.');
    let fileStream = fs.createReadStream(file);
    rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  }

  async function toJson() {
    let arrayOutput = [];
    let errorOutput = [];
    let index = 0;
    let headers = null;
    for await (const line of rl) {
      if (index === 0 && !ignoreHeader) {
        customHeader !== null ? (headers = customHeader) : (headers = splitInputLine(line, null, separators, true).data);
        index++;
      } else {
        const convertedJsonObject = splitInputLine(line, headers, separators, ignoreHeader);
        if (convertedJsonObject.error) {
          if (abortOnError) {
            return Promise.reject(`error found on line ${index}, ${convertedJsonObject.errorInfo}`);
          } else {
            errorOutput.push({
              line,
              index
            })
          }
        } else {
          arrayOutput.push(convertedJsonObject.data);
        }
        index++;
      }
    }
    return {
      response: arrayOutput,
      error: errorOutput
    };
  }

  async function toJsonStream(cb) {
    if (cb === null) throw new Error(`must need a stream call back `);
    let index = 0;
    let headers;
    for await (const line of rl) {
      if (index === 0) {
        customHeader !== null ? (headers = customHeader) : (headers = splitInputLine(line, null, separators, true).data);
        index++;
      } else {
        const convertedJsonObject = splitInputLine(line, headers, separators, false);
        cb({
          data: convertedJsonObject.data,
          completed: false
        });
      }
      cb({
        data: null,
        completed: true
      });
    }
  }

  return {
    toJson,
    toJsonStream
  }
}

const isValidRemoteURL = url => {
  // TODO: Write logic to validate the remote URL
  return true;
}

const csvParse = async function(...givenDataAndOptions) {
  if (givenDataAndOptions.length < 1) {
    throw new Error(`Expected at least one parameter, found ${arguments.length}`);
  }
  let data = givenDataAndOptions[0];
  let options = givenDataAndOptions[1];
  if (typeof data !== 'string') {
    throw new Error(`Expected file name of string type, got ${typeof data}`);
  }
  if (givenDataAndOptions.length === 2) {
    if (typeof options !== 'object') {
      throw new Error(`Expected Options parameter of object type, got ${typeof options}`);
    }
    if (Array.isArray(options)) {
      throw new Error(`Expected Options parameter of object type, got an array`);
    }
  } else if (givenDataAndOptions.length === 1) {
    options = {};
  }

  const parseObj = new Parse(data, options);
  const result = await parseObj.toJson();
  return result;
}

const csvParseStream = async function(...givenDataAndOptions) {
  if (givenDataAndOptions.length < 3) {
    throw new Error(`Expected three parameters, found ${arguments.length}. You must provide a stream callback function as third param. Check user guide for more info.`);
  }
  let data = givenDataAndOptions[0];
  let options = givenDataAndOptions[1];
  let cb = givenDataAndOptions[2];
  if (typeof data !== 'string') {
    throw new Error(`Expected file name of string type, got ${typeof data}`);
  }
  if (typeof cb !== 'function') {
    throw new Error(`Expected callback as a function, got ${typeof data}. You must provide a stream callback function.`);
  }
  if (givenDataAndOptions.length === 2) {
    if (typeof options !== 'object') {
      throw new Error(`Expected Options parameter of object type, got ${typeof options}`);
    }
    if (Array.isArray(options)) {
      throw new Error(`Expected Options parameter of object type, got an array`);
    }
  } else if (givenDataAndOptions.length === 1) {
    options = {};
  }

  const parseObj = new Parse(data, options);
  const result = await parseObj.toJsonStream(cb);
  return result;
}


module.exports = {
  csvParse,
  csvParseStream
}
