var expect = require('chai').expect
  , promisify = require('..')
  , path = require('path');

describe('Promise Monkey', function () {
  var filePath = path.join(__dirname, '..', 'package.json');

  it('should be able to promisify objects', function (done) {
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
      .then(done);
  });

  it('should be able to promisify functions', function (done) {
    var readFile = promisify.convert(require('fs').readFile);
    readFile(filePath)
      .then(function (contents) {
        expect(contents.length).to.be.above(0);
      })
      .then(done);
  });

  it('should be able to promisify node libraries', function (done) {

    var fs = promisify('fs');
    expect(fs.readFile.toString()).to.match(/Q\.defer\(\)/);
    expect(fs.readFileSync.toString()).to.not.match(/Q\.defer\(\)/);

    done();
  });
});
