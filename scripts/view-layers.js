var app = {};
app.views = {};

app.views.BaseLayerView = Backbone.View.extend({
  initialize: function (options) {
  	active = this.findActiveModel();
  },
  findActiveModel: function () {
  	_.each(this.collection.models, function (model) {
  		if (model.get('active')) return model;
  	})
  }
});