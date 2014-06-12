// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

// Model for giving the user autocomplete options
app.models.Typeahead = Backbone.Model.extend({
  defaults: {
    farmsTypeahead: 'undefined',
  },
  initialize: function(){ 
    var model = this;
    this.constructSuggestionEngine(function(response) {
      _.each(response, function (bh) {
        bh.initialize();
      });
      model.set("suggestionEngines", response);
    }); 
  },
  // Construct the suggestion engine for geographical names
  constructSuggestionEngine: function(callback) {
    var model = this;
    var geonamesBH = new Bloodhound({
      name: "GeoNames",
      datumTokenizer: function (d) {
        return Bloodhound.tokenizers.whitespace(d.name);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: "http://api.geonames.org/searchJSON?username=azgs&featureClass=P&maxRows=3&country=US&adminCode1=AZ&name_startsWith=%QUERY",
        filter: function (data) {
          return $.map(data.geonames, function (result) {
            return {
              name: result.name + ", " + result.adminCode1,
              lat: result.lat,
              lng: result.lng,
              source: "GeoNames"
            };
          });
        }
      },
    });
    var farmsBH = new Bloodhound({
      name: "Farms",
      datumTokenizer: function (d) {
        return Bloodhound.tokenizers.whitespace(d.name);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: model.get('farmsTypeahead'),
      limit: 5
    });
    callback([farmsBH, geonamesBH]);
  }
})