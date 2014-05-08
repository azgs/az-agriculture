// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

// Render the basemap
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

app.views.DataLayerView = Backbone.View.extend({
  initialize: function (options) {
    this.addDataToLayer();
    this.addToMap(this.findActiveLayers());
    this.template = _.template($("#toggle-layers-template").html());
  },
  render: function () {
    var el = this.el,
        template = this.template;
    this.collection.each(function (model) {
      return $(el).append(template({
        model: model
      }))
    })
  },
  events: {
    "click a": "switchLayers"
  },
  findActiveLayers: function () {
    var models = [];
    this.collection.each(function (model) {
      if (model.get("active")) models.push(model);
    });
    return models;
  },
  addToMap: function (models) {
    _.each(models, function (model) {
      model.get("layer").addTo(app.map);
    })
  },
  addDataToLayer: function () {
    this.collection.each(function (model) {
      var layer = model.get("layer");
      model.getJSON(function (data) {
        layer.addData(data);
        if (model.get("isExtent") && layer) {
          app.map.fitBounds(layer);
          model.set("isExtent", false);
        }
      })  
    })
  },
  switchLayers: function (e) {
    var toggle = $(e.currentTarget).attr("id"),
        model = this.collection.get(toggle);
    
    if (model.get("active")) {
      model.set("active", false);
      app.map.removeLayer(model.get("layer"));
    } else {
      model.set("active", true);
      app.map.addLayer(model.get("layer"));
    }
  }
});