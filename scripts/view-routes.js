// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.RouteResultsView = Backbone.View.extend({
  initialize: function () {
    this.parentTemplate = _.template($("#show-directions-template").html());
    this.childTemplate = _.template($("#show-directions-items-template").html());
  },
  render: function () {
    var el = this.el;
    if (this.attributes != undefined) {
      $(el).append(this.parentTemplate({
        found: true,
        time: this.formatTime(this.attributes.totalTime),
        distance: this.formatDistance(this.attributes.totalDistance)
      }));
      this.buildRouteTable();
    }
    else {
      $(el).append(this.parentTemplate({
        found: false
      }));
    }
  },
  buildRouteTable: function () {
    var el = this.el,
      view = this,
      data = this.attributes.points.features,
      totalTime = this.attributes.totalTime,
      totalDistance = this.attributes.totalDistance,
      template = this.childTemplate;

    _.each(data, function (item, el) {
      var itemData = {
        "index": item.properties.index,
        "text": item.properties.text,
        "time": item.properties.time,
        "distance": item.properties.distance,
      },
      el = $("#show-directions .list-group").first();
      itemData["time"] = view.formatTime(itemData["time"]);
      itemData["distance"] = view.formatDistance(itemData["distance"]);
      return $(el).append(template({
        data: itemData
      }))
    })   
  },
  formatTime: function (time) {
    var hrs = parseInt(time.split(":")[0], 10);
    var min = parseInt(time.split(":")[1], 10); 
    if (hrs > 0)
      return hrs + ":" + time.split(":")[1] + " hrs";
    if (min > 0)
      return min + " min";
    else
      return "";
  },
  formatDistance: function (distance) {
    var rounded = parseFloat(distance).toFixed(1);
    if (rounded > 0)
      return rounded.replace(/\.0*$/,'') + " mi";
    else  
      return parseInt(distance * 5280) + " ft";
  }
});

// Render the route
app.views.RouteView = Backbone.View.extend({
  initialize: function () {
    var view = this;
    this.template = _.template($("#get-directions-template").html());
  },
  render: function () {
    return $(this.el).append(this.template());
  },
  events: {
    "submit": "getDirections",
    "click .clear": "clear",
  },
  // Clear the route from the panel and the map
  clear: function () {
    $("#show-directions .panel").remove()
    var layers = this.model.get("layer");
    layers.clearLayers();
  },
  getDirections: function () {
    var directions
      , view
      ;

    view = this;
    directions = {
      from: $("#geo-start").val(),
      to: $("#geo-destination").val(),
    };

    if (directions.from == 'My location') {
      view.getCurrentLocation(function (location) {
        directions.from = location;
        directions.to = view.getLocation(directions.to);
        view.route(directions);
        return false;
      });
    }
    else if (directions.to == 'My location') {
      view.getCurrentLocation(function (location) {
        directions.from = view.getLocation(directions.from);
        directions.to = location;
        view.route(directions);
        return false;
      });
    }
    else {
      directions.from = view.getLocation(directions.from);
      directions.to = view.getLocation(directions.to);
      view.route(directions);
      return false;
    }
    return false;
  },
  // Get the lat/long for a selected location if the location 
  // matches a source location in the farms.json data
  getLocation:  function (location) {
    var farmsData = this.model.get('farmsData').features;
    _.each(farmsData, function (farm) {
      if (farm.properties.source === location) {
        location = farm.properties.lat + ", " + farm.properties.lon;
      }
    })
    return location;
  },
  getCurrentLocation: function (callback) {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success (pos) {
      callback(pos.coords.latitude + ", " + pos.coords.longitude);
    }

    function error (err) {
      console.log("ERROR(" + err.code + "): " + err.message);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
    else {
      alert("Please upgrade to a modern web browser which supports geolocation");
    }
  },
  route: function (data, callback) {
    var layers
      , view;
    
    layers = this.model.get("layer"),
    view = this;
    layers.clearLayers();
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

        $("#show-directions .panel").remove()

        new app.views.RouteResultsView({
          el: $("#show-directions").first(),
          attributes: {
            totalTime: data.totalTime,
            totalDistance: data.totalDistance,            
            points: data.points
          },
        }).render();
      }
      // If there was an error calculating directions
      else {
        $("#show-directions .panel").remove()
        
        new app.views.RouteResultsView({
          el: $("#show-directions").first(),
          attributes: undefined,
        }).render();
      }
    });
  }
});