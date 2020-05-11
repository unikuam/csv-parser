const { Parse, Unparse } = require('./utils');

const Parse = require('./utils/Parse');

console.log(__dirname);

Parse.csvParse(__dirname+'/test.csv', {}).then(data=>{
    console.log(data);
}).catch(e=>{
    console.log(e);
})

