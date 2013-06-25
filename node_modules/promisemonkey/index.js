var convert = require('q-wrap').convert
  , request = require('request')
  , fs = require('fs')
  , path = require('path')
  , os = require('os')

function promisify(o, fns) {
  if (typeof o === 'object') {
    var p = Object.create(o);
    fns.forEach(function (fn) {
      if (o[fn]) {
        p[fn] = convert(o[fn]);
      }
    });

    return p;
  } else if (typeof o == 'function') {
    return convert(o);
  }
}

function prequire(mod) {
  var requires = getRequires();
  var lib = require(mod);
  if (lib && (mod in requires)) {
    lib = promisify(lib, requires[mod]);
  }
  return lib;
}

function fetchDocs(cb) {
  var url = 'http://nodejs.org/docs/' + process.version + '/api/all.json';
  request(url, function (err, response, body) {
    cb(err, body);
  });
}

function updateRequires(cb) {
  fetchDocs(function (err, body) {
    if (err) return cb(err);
    try {
      var api = JSON.parse(body);
    } catch (err) {
      return cb(err);
    }

    var requires = extractCallbacks(api)
    cb(null, requires);
  });
}

function getRequires() {
  var requires = {};
  var requiresPath = path.join(__dirname, 'docs', process.version + '.json');
  if (fs.existsSync(requiresPath)) {
    return JSON.parse(fs.readFileSync(requiresPath).toString());
  }

  updateRequires(function (err, requires) {
    fs.writeFileSync(requiresPath, JSON.stringify(requires));
  });

  return requires;
}

function extractCallbacks(api) {
  var requires = {};
  Object.keys(api).filter(function (group) {
    return api[group] instanceof Array;
  })
  .forEach(function (group) {
    api[group].forEach(function (item) {
      if (item.methods) {
        item.methods.forEach(function (method) {
          var callback = false;
          method.signatures.forEach(function (signature) {
            if (!callback && signature.params.length && signature.params[signature.params.length - 1].name === 'callback') {
              callback = true;
              requires[item.name] = requires[item.name] || [];
              requires[item.name].push(method.name);
            }
          });
        });
      }
    });
  });
  return requires;
}

module.exports = prequire;
module.exports.convert = promisify;
