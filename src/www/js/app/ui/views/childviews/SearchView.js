define(function(require) {

  var View = require('lavaca/mvc/View'),
      stateModel = require('app/models/StateModel');
  require('rdust!templates/search');

  /**
   * @class app.ui.views.childviews.SearchView
   * @super Lavaca.mvc.View
   * Search bar view included in BooksView
   */
  var SearchView = View.extend(function(){
    View.apply(this, arguments);

    this.mapEvent({
      '#searchTerm': {
        'change': 'search'
      }
    });

    stateModel.on('search:start', this.toggleSpinner, this);
    stateModel.on('search:stop', this.toggleSpinner, this);
    this.on('rendersuccess', this.initSearch, this);
    this.render();

  }, {
    /**
     * @field {String} template
     * @default 'templates/search'
     * The name of the template used by the view
     */
    template: 'templates/search',
    /**
     * @field {String} className
     * @default 'search'
     * A class name added to the view container
     */
    className: 'search',

    ui: {
      spinner: '#spinner',
      searchTerm: '#searchTerm'
    },

    toggleSpinner: function (e) {
      if (e.start === 'start') {
        this.ui.spinner.fadeIn();
      } else {
        this.ui.spinner.fadeOut();
      }
    },

    initSearch: function(e) {
      var term = this.model.get('term');
      if (!term) {
        term = 'CSS';
      }
      this.ui.searchTerm.val(term).change();
    },

    search: function () {
      var searchTerm = this.ui.searchTerm.val().trim();
      if (searchTerm.length > 0) {
        this.model.set('term', searchTerm);
        stateModel.trigger('search:clearMessage');
        stateModel.trigger('search:term', { term: searchTerm, reset:true });
      } else {
        stateModel.trigger('search:noSearchTerm', { message: "Hummmm, can do better :)"});
      }
    },

    dispose: function () {
      stateModel.off('search:start', this.toggleSpinner, this);
      stateModel.off('search:stop', this.toggleSpinner, this);

      return View.prototype.dispose.apply(this, arguments);
    }

  });

  return SearchView;
});