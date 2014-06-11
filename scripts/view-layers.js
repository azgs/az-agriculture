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

app.views.FarmsView = Backbone.View.extend({
  initialize: function (options) {
    this.addDataToLayer();
    this.addToMap();
    this.template = _.template($("#toggle-layers-template").html());
  },
  render: function () {
    var el = this.el,
        template = this.template,
        model = this.model;
  },
  events: {
    "click a": "switchLayers",
    "click button": "toggleLayers" ,
  },
  addToMap: function () {
    this.model.get("layer").addTo(app.map);
  },
  addDataToLayer: function () {
    var self = this;
    var model = this.model;
    var layer = model.get("layer");
    model.getJSON(function (data) {
      layer.addData(data);
      if (model.get("isExtent") && layer) {
        app.map.fitBounds(layer);
        model.set("isExtent", false);
      }
      var crops = model.get('crops');
      var seasons = model.get('seasons');
      $(self.el).append(self.template({
        model: model,
        crops: crops,
        seasons: seasons,
      }))
			
			// Create the typeahead lists
			app.typeaheadView = new app.views.TypeaheadView({
				model: new app.models.Typeahead({})
			}).render();
    })
  },
  toggleLayers: function (e) {
    var target = $(e.currentTarget);
    if (target.hasClass("active")) {
      target.removeClass("active");
    } else {
      target.addClass("active");
    }
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