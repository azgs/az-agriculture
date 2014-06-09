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
  getJSON: function (callback) {
    var model = this;
    if (model.get('serviceUrl')) {
      d3.json(model.get("serviceUrl"), function (err, data) {
        if (err) callback(err);
/*
        model.set('crops', []);
        model.set('seasons', []);
        _.each(data.features, function (layer) {
          var crops = layer.properties.crop;
          _.each(crops, function (crop) {
            if (crop) {
              if (_.indexOf(model.get('crops'), crop.type) < 0) {
                model.get('crops').push(crop.type);
              }
              _.each(crop.season, function (season) {
                if (_.indexOf(model.get('seasons'), season) < 0) {
                  model.get('seasons').push(season);
                }
              })
            }
          })
        })
*/
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