// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

// Base model for how we define a Leaflet layer
app.models.LayerModel = Backbone.Model.extend({
  defaults: {
  	id: 'undefined',
  	serviceUrl: 'undefined',
  	active: false,
  	detectRetina: true,
  },
  initialize: function (options) {
  	this.set('layer', this.createLayer(options));
  },
  createLayer: function (options) {},
});

// Model for how we define a Leaflet GeoJSON layer
app.models.GeoJSON = app.models.LayerModel.extend({
  createLayer: function (options) {
    if (options.type === 'LineString') {
      return new L.geoJson(options.data)
    }
  }
});

// Model for how we define a Leaflet Tile layer
app.models.TileLayer = app.models.LayerModel.extend({
  createLayer: function (options) {
  	if (options.serviceUrl) {
  	  return new L.tileLayer(options.serviceUrl, options);
  	}
  }
});

// Base model for how we define a collection of layers
app.models.LayerCollection = Backbone.Model.extend({
  model: app.models.LayerModel
});