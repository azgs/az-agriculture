// MODELS -------------------------------------------------------------
LayerModel = Backbone.Model.extend({
  defaults: {
  	serviceUrl: 'undefined',
  	detectRetina: true,
  },
  initialize: function (options) {
  	this.set('layer', this.createLayer(options));
  },
  createLayer: function (options) {},
});

TileLayer = LayerModel.extend({
  createLayer: function (options) {
  	if (options.serviceUrl) {
  	  return new L.tileLayer(options.serviceUrl, options);
  	}
  }
});




// VIEW -------------------------------------------------------------
BaseLayerView = Backbone.View.extend({
  initialize: function (options) {
  	active = this.findActiveModel();
  	console.log(active.get('layer'));
  	map.addLayer(active.get("layer"));
  },
  render: function () {
  },
  findActiveModel: function () {
  	if (this.model.get('active')) return this.model;
  }
});







// Make a map
map = L.map('map', {
  center: [35.024994, -111.820046],
  zoom: 7,
})

// Use the model
var baseLayer = new TileLayer({
  id: 'osm-basemap',
  serviceUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  serviceType: 'WMS',
  active: true,
  detectRetina: true,
});

// CONTROLLER -------------------------------------------------------
baseLayerRender = new BaseLayerView({
  model: baseLayer
});

baseLayerRender.render();