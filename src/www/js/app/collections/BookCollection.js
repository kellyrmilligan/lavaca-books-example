define(function(require) {
  var Collection = require('lavaca/mvc/Collection');
  var BookModel = require('app/models/BookModel');
  var StateModel = require('app/models/StateModel');

  var BookCollection = Collection.extend(function() {
    Collection.apply(this, arguments);

    StateModel.on('search:term', this.search, this);
    StateModel.on('search:more', this.moreBooks, this);
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

    url: 'https://www.googleapis.com/books/v1/volumes',

    maxResults: 20,

    page: 0,

    loading: false,

    totalItems: null,

    previousSearch: null,

    search: function (e) {
      var searchTerm = e.term,
          reset = e.reset;

      if (this.loading) {
        return true;
      }

      if (reset) {
        this.clearModels();
      }
      var opts = {};

      opts = {
        dataType: 'jsonp',
        data: {
          q: searchTerm,
          maxResults: this.maxResults,
          startIndex: this.page * this.maxResults,
          fields: 'totalItems,items(id,volumeInfo/title,volumeInfo/subtitle,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/description,volumeInfo/imageLinks)'
        }
      };


      StateModel.trigger("search:start", { start: 'start'});

      this.loading = true;

      this.fetch(opts)
        .then(this.searchSuccess.bind(this), this.searchFailure.bind(this));

      this.previousSearch = searchTerm;
    },

    searchSuccess: function(res) {
      StateModel.trigger('search:stop', 'stop');
      this.loading = false;
      if (this.count() === 0) {
        StateModel.trigger("search:noResults", { message: "No Books Found :(" });
      }
    },

    /**
     * @method onFetchSuccess
     * Processes the data received from a fetch request
     *
     * @param {Object} response  The response data
     */
    onFetchSuccess: function(response) {
      var list;
      response = this.parse(response);
      if (this.responseFilter && typeof this.responseFilter === 'function') {
        response = this.responseFilter(response);
      }
      list = response;
      if (!(list instanceof Array)) {
        this.apply(response);
        if (response && response.hasOwnProperty(this.itemsProperty)) {
          list = response[this.itemsProperty];
        }
      }
      this.add.apply(this, list);
      this.trigger('fetchSuccess', {response: response});
    },

    searchFailure: function(res) {
      StateModel.trigger("search:error", "Error, please retry later :s");
      this.loading = false;
    },

    responseFilter: function (res) {
      if (typeof res === 'object' && res.items) {
        if (res && res.hasOwnProperty('totalItems')) {
          this.totalItems = res.totalItems;
          this.page++;
        }
        return res.items;
      } else {
        return null;
      }
    },

    moreBooks: function () {
      if(this.length >= this.totalItems) {
        return true;
      }

      this.search({ term: this.previousSearch, reset: false });
    },

    dispose: function () {
      StateModel.off('search:term', this.search, this);
      StateModel.off('search:more', this.moreBooks, this);

      return Collection.prototype.dispose.apply(this, arguments);
    }

  });

  return new BookCollection();
});