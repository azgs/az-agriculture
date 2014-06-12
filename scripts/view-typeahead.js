// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

// Render the typeahead functionality
app.views.TypeaheadView = Backbone.View.extend({
  initialize: function() {
    var view = this;
    view.bindTypeahead("#geo-start");
    view.bindTypeahead("#geo-destination");
  },
  bindTypeahead: function(ele) {
    var suggestionEngines = this.model.get("suggestionEngines");
    $(ele).typeahead({
      minLength: 2,
      highlight: true,
      hint: true
    },  {
      name: "Farms",
      displayKey: "name",
      source: suggestionEngines[0].ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'><img src='images/barn.png' width='20' height='20'>&nbsp;Farms</h4>"
      }
    }, { 
      name: "GeoNames",
      displayKey: "name",
      source: suggestionEngines[1].ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'><img src='images/globe.png' width='20' height='20'>&nbsp;Arizona Places</h4>"
      }
    });
  }
});