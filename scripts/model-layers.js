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
    isExtent: false,
    layerOptions: 'undefined',
  },
  initialize: function (options) {
    var model = this;
    model.createLayer(options, function (layer) {
      model.set('layer', layer);
    })
  },
  createLayer: function (options) {},
});

// Model for how we define a Leaflet GeoJSON layer
app.models.GeoJSONLayer = app.models.LayerModel.extend({
  createLayer: function (options, callback) {
    var layer = new L.geoJson(null, this.get("layerOptions"));
    callback(layer);
  },
  toggleSupport: function (data) {
    var self = this;
    var sanityCrop = [];
    self.set('crops', []);
    self.set('seasons', [
      {"id": "winter", "display": "Winter", 
        "months": ["december", "january", "february"]},
      {"id": "spring", "display": "Spring",
        "months": ["march", "april", "may"]},
      {"id": "summer", "display": "Summer",
        "months": ["june", "july", "august"]},
      {"id": "fall", "display": "Fall",
        "months": ["september", "november", "december"]},
    ]);
    _.each(data.features, function (layer) {
      var crops = layer.properties.crop;
      _.each(crops, function (crop) {
        if (crop) {
          if (_.indexOf(sanityCrop, crop.type) < 0) {
            sanityCrop.push(crop.type);
            var normalize = crop.type.replace(/\s/g, '').toLowerCase();
            var item = {"id": normalize, "display": crop.type};
            self.get('crops').push(item);
          }
        }
      })
    })
  },
  getJSON: function (callback) {
    var self = this;
    if (self.get('serviceUrl')) {
      d3.json(self.get("serviceUrl"), function (err, data) {
        if (err) callback(err);
        self.toggleSupport(data);
        callback(data);
      })
    }
  },
});

// Model for how we define a Leaflet Tile layer
app.models.TileLayer = app.models.LayerModel.extend({
  createLayer: function (options, callback) {
    var model = this;
  	if (model.get("serviceUrl")) {
  	  var layer = new L.tileLayer(model.get("serviceUrl"), options);
      callback(layer);
  	}
  }
});

// Base model for how we define a collection of layers
app.models.LayerCollection = Backbone.Model.extend({
  model: app.models.LayerModel
});