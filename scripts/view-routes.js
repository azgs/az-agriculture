// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

// Render the route
app.views.RouteView = Backbone.View.extend({
  initialize: function () {
  	var view = this;
		$("#get-directions2").click(function(){ view.startRouting()});
  },
	startRouting: function () {
/*
		$("#routesModal").modal('hide');
		this.model.set("from", $("#fromLocation").val());
		this.model.set("to", $("#toLocation").val());
*/
		this.route();
	},
  render: function () {},
  route: function () {
    var layers = this.model.get("layer")
    this.model.createLayers();
  	// Look into the JSON object and build GeoJSON features
    this.model.processRoute(function (data) {
      if (data) {
        var linesLayer = layers.getLayers()[0],
            pointsLayer = layers.getLayers()[1],
            bbox = data.bbox;
        linesLayer.addData(data.lines);
        pointsLayer.addData(data.points);

        app.map.fitBounds([
          [bbox.ul.lat, bbox.ul.lng], 
          [bbox.lr.lat, bbox.lr.lng]
        ]);
      }
    });
  }
});