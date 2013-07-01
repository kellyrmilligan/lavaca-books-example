define(function(require) {

  var BaseView = require('./BaseView');
  require('rdust!templates/books');
  var Config = require('lavaca/util/Config');
  var SearchView = require('./childviews/SearchView');
  var searchModel = require('../../models/SearchModel');
  var BookCollectionView = require('./childViews/BookCollectionView');
  var bookCollection = require('../../collections/BookCollection');

  /**
   * @class app.ui.views.BooksView
   * @super app.ui.views.BaseView
   * Books View
   */
  var BooksView = BaseView.extend(function () {
    BaseView.apply(this, arguments);

    //map the search bar and the book list views
    this.mapChildView({
      '#searchBar': {
        TView: SearchView,
        model: searchModel
      },
      '#bookContainer': {
        TView: BookCollectionView,
        model: bookCollection
      }
    });



  },{
    /**
     * @field {String} template
     * @default 'templates/books'
     * The name of the template used by the view
     */
    template: 'templates/books',
    /**
     * @field {String} className
     * @default 'books'
     * A class name added to the view container
     */
    className: 'books-page'

  });

  return BooksView;

});
