// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.RouteResultsView = Backbone.View.extend({
  initialize: function () {
    console.log(this.attributes);
    this.parentTemplate = _.template($("#show-directions-template").html());
//    this.childTemplate = _.template($("#show-directions-items-template").html());
  },
  render: function () {
    var el = this.el;
    return $(el).append(this.parentTemplate());
  },
  buildRouteTable: function () {
    var el = this.activeEl,
        data = this.attributes.features,
        template = this.childTemplate;
    _.each(data, function (item) {
      var itemData = {
        "text": item.properties.text,
        "time": item.properties.time,
        "distance": item.properties.distance,
      };

      return $(el).append(template({
        data: itemData
      }))
    })   
  }
});

// Render the route
app.views.RouteView = Backbone.View.extend({
  initialize: function () {
  	var view = this;
    this.template = _.template($("#get-directions-template").html());
  },
  render: function () {
    var el = this.el,
        template = this.template;
    return $(el).append(template());
  },
  events: {
    "submit": "getDirections",
  },
  getDirections: function () {
    var directions = {
      from: $("#geo-start").val(),
      to: $("#geo-destination").val(),
    };

    this.route(directions)
    return false;
  },
  route: function (data, callback) {
    var layers = this.model.get("layer")
    this.model.createLayers();
  	// Look into the JSON object and build GeoJSON features
    this.model.processRoute(data, function (data) {
      if (data) {
        var linesLayer = layers.getLayers()[0],
            pointsLayer = layers.getLayers()[1],
            bbox = data.bbox;
        linesLayer.addData(data.lines);
        pointsLayer.addData(data.points);

        app.map.fitBounds([
          [bbox.ul.lat, bbox.ul.lng], 
          [bbox.lr.lat, bbox.lr.lng]
        ]);

        new app.views.RouteResultsView({
          el: $("#contrib-accordion").first(),
          attributes: data.points,
        }).render();
      }
    });
  }
});