var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.RouteView = Backbone.View.extend({
  initialize: function (options) {
  	this.route(options);
  },
  render: function () {},
  route: function () {
    this.model.processRoute(function (data) {
      if (data.lines) {
	  	var layer = new L.geoJson(data.lines, {
	  	  style: {
	  	  	weight: 3,
	  	  	opacity: 1,
	  	  	color: "red",
	      }
	  	});
	  	layer.addTo(app.map);
	  }
      if (data.points) {
      	var layer = new L.geoJson(data.points, {
      	  pointToLayer: function (feature, latlng) {
      	  	return L.circleMarker(latlng, {
      	  	  radius: 5,
      	  	  fillColor: "red",
      	  	  color: "orange",
      	  	  weight: 3,
      	  	  opacity: 1,
      	  	  fillOpacity: 1,
      	  	})
      	  }
      	}).addTo(app.map);
      }
      if (data.bbox) {
      	var bbox = data.bbox;
      	app.map.fitBounds([[bbox.ul.lat, bbox.ul.lng], [bbox.lr.lat, bbox.lr.lng]]);
      }
    });
  }
});