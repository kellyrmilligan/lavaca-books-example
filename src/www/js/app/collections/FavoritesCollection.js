define(function(require) {
  var Collection = require('lavaca/mvc/Collection');
  var BookModel = require('app/models/BookModel');
  var StateModel = require('app/models/StateModel');

  var FavoriteCollection = Collection.extend(function() {
    Collection.apply(this, arguments);

    StateModel.on('favorite:add', this.addFavorite, this);
  },{

    /**
     * @field {Object} TModel
     * @default [[BookCollection]]
     * The type of model object to use for items in this collection
     */
    TModel: BookModel,
    /**
     * @field {String} itemsProperty
     * @default 'books'
     * The name of the property containing the collection's items when using toObject()
     */
    itemsProperty: 'books',


    dispose: function () {
      StateModel.off('favorite:add', this.addFavorite, this);

      return Collection.prototype.dispose.apply(this, arguments);
    }

  });

  return new FavoriteCollection();
});