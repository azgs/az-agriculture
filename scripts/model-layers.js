var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

app.models.LayerModel = Backbone.Model.extend({
  defaults: {
  	serviceUrl: 'undefined',
  	detectRetina: true,
  },
  initialize: function (options) {
  	this.set('layer', this.createLayer(options));
  },
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