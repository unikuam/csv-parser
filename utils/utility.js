const splitInputLine = (
  line, // line to be split
  header = null, // header items (for creating json object)
  seperators = null, // seperator array to find valid seperators
  returnArray = false //
) => {
  let isError = false;
  let errorMsg = '';
  if (line.trim() === "" || typeof line !== "string") {
    isError = true;
    errorMsg = `Expected line of CSV of string type, got ${typeof line}`;
  }

  let splitRegex, joinedSeparator;
  if (seperators === null || seperators.length === 0) {
    splitRegex = ",";
  } else {
    splitRegex = seperators.join(""); // assuming space for no separator provided.
    if (splitRegex.indexOf(',') === -1) {
      splitRegex = splitRegex.concat(',');
    }
    if (splitRegex.indexOf('-') >= 0) {
      splitRegex = splitRegex.replace(/-/g, '');
      splitRegex = splitRegex.concat('-');
    }
  }
  let regExp = new RegExp("[" + splitRegex + "]+", "g");
  // removing commented part from line if any
  var commentPosition = line.indexOf("#");
  if (commentPosition !== -1) {
    line = line.substring(0, commentPosition);
  }

  const splittedArray = regExp[Symbol.split](line);

  if (header !== null && (header.length !== splittedArray.length)) {
    isError = true;
    errorMsg = 'Provided CSV format is invalid. All rows in CSV must have the same number of fields as the provided header has';
  }

  if (isError) return {
    data: null,
    error: true,
    errorInfo: errorMsg
  };

  if (returnArray === true) {
    // return an array
    return {
      data: splittedArray,
      error: false
    };
  } else {
    const splittedArray = regExp[Symbol.split](line);
    let seperatedObject = {};
    for (const index in header) {
      seperatedObject[header[index]] = splittedArray[index];
    }
    return {
      data: seperatedObject,
      error: false
    };
  }
}

const isComment = line => {
  return line[0] === "#";
}

const parseObjectToCSV = obj => {
  let csvString = ""
  for (const el of Object.keys(obj)) {
    csvString = csvString + obj[el] + ","
  }
  return csvString.substring(0, csvString.length - 1);
}

module.exports = {
  splitInputLine,
  isComment,
  parseObjectToCSV
}

// console.log(splitInputLine('aaa ,bbb,ccc#dddede', ["header1", "header2", "header3"], [',']));
