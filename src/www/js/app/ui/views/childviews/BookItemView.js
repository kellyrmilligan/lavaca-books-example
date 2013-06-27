define(function(require) {

  var View = require('lavaca/mvc/View'),
      BookDetailView = require('app/ui/views/childviews/BookDetailView'),
      StateModel = require('app/models/StateModel');
  require('rdust!templates/book-item');

  /**
   * @class app.ui.views.childviews.BookItemView
   * @super Lavaca.mvc.View
   * Book Item view type
   */
  var BookItemView = View.extend(function () {
      View.apply(this, arguments);

      this.mapEvent({
        self: {
          'click': this.showBookDetail.bind(this)
        }
      });

      this.render();

      this.el.attr('data-book-id', this.model.get('id'));

    }, {
    /**
     * @field {String} template
     * @default 'templates/book-list'
     * The name of the template used by the view
     */
    template: 'templates/book-item',
    /**
     * @field {String} className
     * @default 'book-list'
     * A class name added to the view container
     */
    className: 'book-item',

    showBookDetail: function () {
      var detailView = new BookDetailView($('<div>'),this.model);
      StateModel.trigger('modal:show', {view: detailView});
    }


  });

  return BookItemView;
});