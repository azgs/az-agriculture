var app = {};
app.models = {};

app.models.LayerModel = Backbone.Model.extend({
  defaults: {
  	serviceUrl: 'undefined',
  	detectRetina: true,
  },
  initialize: function () {},
  createLayer: function (options) {},
});

app.models.TileLayer = app.models.LayerModel.extend({
  createLayer: function (options) {
  	if (options.serviceUrl) {
  	  return new L.tileLayer(options.serviceUrl, options);
  	}
  }
});

app.models.LayerCollection = Backbone.Model.extend({
  model: app.models.LayerModel
});