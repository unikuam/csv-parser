**INTRODUCTION**

This API will parse &amp; unparse any file with CSV format.

**HOW TO USE API**

First you need to include the library as mentioned below:

_const { Parse, Unparse } = require(&#39;./utils&#39;);_

To parse a file with CSV format, you need to call a function as mentioned below:

Parse.csvParse(\_\_dirname+&#39;/test.csv&#39;, {}).then(data=\&gt;{

console.log(data);

}).catch(e=\&gt;{

console.log(e);

});

To Unparse a file with a valid JSON format into CSV format, you need to call a function as mentioned below:

Parse.csvUnparse(\_\_dirname+&#39;/test.json, {}).then(data=\&gt;{

console.log(data);

}).catch(e=\&gt;{

console.log(e);

})

To parse a file in chunks, you need to call a function like mentioned below:

Parse.csvParseStream(\_\_dirname+&#39;/test.csv&#39;, {}, cb).then(data=\&gt;{

console.log(data);

}).catch(e=\&gt;{

console.log(e);

});

Cb is a callback function which a user must provide.

**WHAT ARE DIFFERENT OPTIONS AVAILABLE**

There are following options in our API which you need to provide as a second parameter. It should be an object. These parameters are applicable only for parsing.

1. **Separators** : Default separator is &quot;,&quot; but you can pass other separators also in array. Check below example for the same:

Parse.csvParse(\_\_dirname+&#39;/test.csv&#39;, { separators: [&#39;.&#39;, &#39;!&#39;. &#39;-&#39;] });

You need not to provide &quot;,&quot; separator as it will be appended automatically if you do not provide it.

1. **abortOnError** : If true, then the parsing process will stop on error otherwise, it will keep on parsing. Default value is false.

Parse.csvParse(\_\_dirname+&#39;/test.csv&#39;, { abortOnError: true });

1. **isRemoteUrl** : If true, then you can parse a CSV available remotely. Default value is false.

Parse.csvParse(&quot;[http://algorithm-visualizer-am.netlify.app/test.csv](http://algorithm-visualizer-am.netlify.app/test.csv)&quot;, { isRemoteUrl: true });

1. **customHeader** : Default value is null. If you provide an array of fields then current headers will be overridden with the default one. It should be an array.

Parse.csvParse(\_\_dirname+&#39;/test.csv&#39;, { customHeader: [&#39;field\_1&#39;, &#39;field\_2&#39;] });

1. **ignoreHeader** : If true then the first line of CSV file will be treated as the keys for rest field values and if false then it will return the first row as an array. Default value is false.

Parse.csvParse(\_\_dirname+&#39;/test.csv&#39;, { ignoreHeader: true });

_**JSON (ignoring headers):**_

[[&quot;field\_1&quot;, &quot;field\_2&quot;, &quot;field\_3&quot;],

[&quot;aaa&quot;, &quot;bbb&quot;, &quot;ccc&quot;],

[&quot;xxx&quot;, &quot;yyy&quot;, &quot;zzz&quot;] ]

_**JSON (using headers):**_

[ {&quot;field\_1&quot;: &quot;aaa&quot;, &quot;field\_2&quot;: &quot;bbb&quot;, &quot;field\_3&quot;: &quot;ccc&quot;},

{&quot;field\_1&quot;: &quot;xxx&quot;, &quot;field\_2&quot;: &quot;yyy&quot;, &quot;field\_3&quot;: &quot;zzz&quot;} ]

**FUTURE IMPLEMENTATION**

Making it work with File System Stream like the following example:

fs.createReadStream(inputFile)

.pipe(Parse.csvParse()).on(&#39;data&#39;, function (data) {

try {

csvArray.push(data);

} catch (err) {

throw new Error(err);

}

})
