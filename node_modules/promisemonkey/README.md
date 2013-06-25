# promisemonkey

Easily convert objects, functions and METHODs to the Q promise API

# Installation

You can install promisemonkey through npm:
```
$ npm install promisemonkey
```

# Example

## Access standard node APIs as promises

You can easily acccess the standard node APIs as promises:

``` js
var promisify = require('promisemonkey');
var fs = promisify('fs');
fs.stat(filePath)
  .then(function (stats) {
    expect(stats.size).to.be.above(0);
  });
```

## Convert an object

You can pass through a object with methods and then an array of the method
names to promisify:

``` js
var promisify = require('promisemonkey');

// Pass through an object and array of method names
var fs = promisify.convert(require('fs'), ['readFile', 'stat']);

// All the underlying functions should be accessible
var contents = fs.readFileSync(filePath).toString();
expect(contents.length).to.be.above(0);

// You can then use the object methods which are now promisified
fs.stat(filePath)
  .then(function (stats) {
    expect(stats.size).to.be.above(0);
    return fs.readFile(filePath);
  })
  .then(function (contents) {
    expect(contents.length).to.be.above(0);
  })
```

## Convert a function

And, of course you can promisify a plain old function

``` js
var readFile = promisify.convert(require('fs').readFile);
readFile(filePath)
  .then(function (contents) {
    expect(contents.length).to.be.above(0);
  })
```
