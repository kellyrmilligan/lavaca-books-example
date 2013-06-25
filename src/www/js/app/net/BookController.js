define(function(require) {

  var BooksView = require('app/ui/views/BooksView'),
      BaseController = require('app/net/BaseController'),
      Translation = require('lavaca/util/Translation'),
      localStore = require('app/cache/localStore'),
      stateModel = require('app/models/StateModel');

  /**
   * @class app.net.BookController
   * @super app.net.BaseController
   * Book controller
   */
  var BookController = BaseController.extend({
    /**
     * @method index
     * Index action, creates a history state and shows a view
     *
     * @param {Object} params  Action arguments
     * @param {Object} model  History state model
     * @return {Lavaca.util.Promise}  A promise
     */
    index: function(params, model) {

      return this
        .view(null, BooksView, model)
        .then(this.updateState(model, 'Books', params.url));
    }

  });

  return BookController;

});
