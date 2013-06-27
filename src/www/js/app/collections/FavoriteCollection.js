define(function(require) {
  var Collection = require('lavaca/mvc/Collection');
  var BookModel = require('app/models/BookModel');
  var stateModel = require('app/models/StateModel');

  var FavoriteCollection = Collection.extend(function() {
    Collection.apply(this, arguments);

    stateModel.on('favorite:add', this.addFavorite, this);
    stateModel.on('favorite:remove', this.removeFavorite, this);
    stateModel.on('favorite:search', this.search, this);
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

    addFavorite: function (e) {
      this.add(e.model);
    },

    removeFavorite: function (e) {
      this.remove(e.model);
    },

    search: function (e) {
      var model = this.first({id: e.id});

      stateModel.trigger('favorite:searchResult', { isFavorite: model ? true : false });
    },

    dispose: function () {
      stateModel.off('favorite:add', this.addFavorite, this);
      stateModel.off('favorite:remove', this.removeFavorite, this);
      stateModel.off('favorite:search', this.search, this);
      return Collection.prototype.dispose.apply(this, arguments);
    }

  });

  return new FavoriteCollection();
});