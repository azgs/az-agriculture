// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

// Model for giving the user autocomplete options
app.models.Typeahead = Backbone.Model.extend({
	defaults: {},
	initialize: function(){ 
		var model = this;
		this.constructSuggestionEngine(function(response) {
			response.initialize();
			model.set("suggestionEngine", response);
			}) },
	// Construct the suggestion engine for geographical names
	constructSuggestionEngine: function(callback) {
		var geonamesBH = new Bloodhound({
			name: "GeoNames",
			datumTokenizer: function (d) {
				return Bloodhound.tokenizers.whitespace(d.name);
			},
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: "http://localhost:3000/farms.json",
				filter: function (data) {
					return $.map(data.features, function (result) {
						return {
							name: result.properties.source,
							lat: result.properties.lat,
							lng: result.properties.lon,
							source: "GeoNames"
						};
					});
				}
			}
		});
	callback(geonamesBH);
	}
})