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
        'change': this.search.bind(this)
      }
    });

    this.render();

    this.ui= {
      spinner: this.el.find('#spinner'),
      searchTerm: this.el.find('#searchTerm')
    };

    stateModel.on('search:start', this.toggleSpinner, this);
    stateModel.on('search:stop', this.toggleSpinner, this);
    stateModel.on('search:term', this.setSearchTerm, this);

    this.ui.searchTerm.val('CSS').change();

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


    toggleSpinner: function (e) {
      if (e.start === 'start') {
        this.ui.spinner.fadeIn();
      } else {
        this.ui.spinner.fadeOut();
      }
    },

    setSearchTerm: function(term) {
      if (!this.ui.searchTerm.val()) {
        this.ui.searchTerm.val(term);
      }
    },

    search: function () {
      var searchTerm = this.ui.searchTerm.val().trim();
      if (searchTerm.length > 0) {
        stateModel.trigger('search:clearMessage');
        stateModel.trigger('search:term', { term: searchTerm, reset:true });
      } else {
        stateModel.trigger('search:noSearchTerm', { message: "Hummmm, can do better :)"});
      }
    },

    dispose: function () {
      stateModel.off('search:start', this.toggleSpinner, this);
      stateModel.off('search:stop', this.toggleSpinner, this);
      stateModel.off('search:term', this.setSearchTerm, this);

      return View.prototype.dispose.apply(this, arguments);
    }

  });

  return SearchView;
});