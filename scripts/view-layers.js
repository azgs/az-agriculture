var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.BaseMapView = Backbone.View.extend({
  initialize: function (options) {
  	active = this.findActiveModel();
  	app.map.addLayer(active.get('layer'));
  },
  render: function () {},
  findActiveModel: function () {
  	if (this.model.get('active')) return this.model;
  }
});
