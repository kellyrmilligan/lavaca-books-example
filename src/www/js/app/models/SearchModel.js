define(function(require) {
  var Model = require('lavaca/mvc/Model');


  var SearchModel = Model.extend(function() {
    Model.apply(this, arguments);
  },{

  });

  return new SearchModel();
});