define(function(require) {

  var View = require('lavaca/mvc/View'),
      StateModel = require('app/models/StateModel');
  require('rdust!templates/book-detail');

  /**
   * @class app.ui.views.childviews.BookDetailView
   * @super Lavaca.mvc.View
   * Book Detail view type
   */
  var BookDetailView = View.extend(function () {
      View.apply(this, arguments);

      this.render();

    }, {
    /**
     * @field {String} template
     * @default 'templates/book-detail'
     * The name of the template used by the view
     */
    template: 'templates/book-detail',
    /**
     * @field {String} className
     * @default 'book-detail'
     * A class name added to the view container
     */
    className: 'modal bookDetail'

  });

  return BookDetailView;
});