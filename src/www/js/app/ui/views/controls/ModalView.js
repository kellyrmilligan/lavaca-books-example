define(function(require) {

  var View = require('lavaca/mvc/View'),
      bootstrap = require('bootstrap'),
      StateModel = require('app/models/StateModel');
  require('rdust!templates/book-detail');

  /**
   * @class app.ui.views.controls.ModalView
   * @super Lavaca.mvc.View
   * Modal view type
   */
  var ModalView = View.extend(function () {
      View.apply(this, arguments);
      StateModel.on('modal:show', this.renderModal.bind(this));

      this.el.on('hidden', this.closeModal.bind(this));
    }, {
    /**
     * @field {String} template
     * @default 'templates/book-detail'
     * The name of the template used by the view
     */
    template: null,
    /**
     * @field {String} className
     * @default 'book-detail'
     * A class name added to the view container
     */
    className: null,

    modalViews: [],

    renderModal: function (e) {
      var view = e.view;
      this.modalViews.push(view);
      this.el.append(this.modalViews[0].el);
      this.el.modal('show');
    },

    closeModal: function (e) {
      this.el.modal('hide');
      var oldView = this.modalViews.splice(0,1);
      oldView[0].dispose();
      oldView[0].el.remove();
    },

    dispose: function () {
      StateModel.off('modal:show', this.renderModal.bind(this));
      return View.prototype.dispose.apply(this, arguments);
    }

  });

  return ModalView;
});