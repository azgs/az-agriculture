// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

// Render the typeahead functionality
app.views.TypeaheadView = Backbone.View.extend({
  initialize: function() {
		var view = this;
		view.bindTypeahead("#fromLocation");
		view.bindTypeahead("#toLocation");
	},
	bindTypeahead: function(ele) {
		var suggestionEngine = this.model.get("suggestionEngine");
		$(ele).typeahead({
			minLength: 2,
			highlight: true,
			hint: true
		}, {
			name: "GeoNames",
			displayKey: "name",
			source: suggestionEngine.ttAdapter()
		});
	}
});
