// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

// Model for getting browser location
app.models.GeoLocate = Backbone.Model.extend({
  defaults: {
    active: false,
    farmsJson: 'undefined',
  },
  initialize: function () {
    var model = this;
    model.isGeoCompatible(function (response) {
      if (response) {
        model.set("active", true);
      }
    })
  },
  isGeoCompatible: function (callback) {
    if ("geolocation" in navigator) {
      callback(true);
    } else {
      callback(false);
    }
  },
  getCurrentPosition: function (callback) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var geo = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude,
      }
      callback(geo);
    })
  }
});

// Model for interacting with the MapQuest routing REST API
app.models.Route = Backbone.Model.extend({
  defaults: {
    baseUrl: 'http://open.mapquestapi.com/directions/v2/route?',
    key: 'Fmjtd%7Cluur2q01ng%2Crw%3Do5-9abxuw',
    ambiguities: 'ignore',
    generalize: '0', // Smooth out fullShape
    from: 'Tucson,AZ', // Starting point
    to: 'Phoenix,AZ', // Destination
  },
  initialize: function () {
    var model = this;
    this.createLayerGroup(function (group) {
      group.addTo(app.map);
      model.set("layer", group);
    });
  },
  createLayerGroup: function (callback) {
    var group = new L.layerGroup();
    callback(group);
  },
  createLayers: function () {
    var lineOptions = this.get("lineOptions"),
        circleOptions = this.get("circleOptions"),
        lineLayer = new L.geoJson(null, lineOptions),
        pointLayer = new L.geoJson(null, circleOptions);
    this.get("layer").addLayer(lineLayer);
    this.get("layer").addLayer(pointLayer);    
  },
  // Construct a URL and return data from that URL
  getRoute: function (contributeData, callback) {
    var from = contributeData.from,
        to = contributeData.to,
        url = this.get('baseUrl')+'key='+this.get('key')+'&ambiguities='
              +this.get('ambiguities')+'&generalize='+this.get('generalize')
              +'&from='+from+'&to='+to;

  d3.json(url, function (err, data) {
      if (err) callback(err);
      callback(data);
    })
  },
  // Take the MapQuest routing response and turn it into something we can use
  processRoute: function (contributeData, callback) {
    // Call the AJAX function and get a response
    this.getRoute(contributeData, function (data) {
      if (data.info.statuscode != "0") {
        callback(undefined);
      }
      else {
        // Get some of the scoped data first and make an associative array
        var routeInfo = _.map(data.route.legs, function (leg) {
          var maneuvers = _.map(leg.maneuvers, function (move) {
            return {
              index: move.index,
              cardinal: move.directionName,
              distance: move.distance,
              time: move.formattedTime,
              text: move.narrative,
              start: move.startPoint,
            }
          });

          return {
            distance: leg.distance,
            time: leg.formattedTime,
            maneuvers: maneuvers,
          }
        });
        // Get the array of total lat/lng points for the route
        var fullShape = data.route.shape.shapePoints,
            bbox = data.route.boundingBox;
        // Make a two dimensional associative array out of 'fullShape'
        var shape = function (data) {
          var shapes = [];
          for (var i=0; i<data.length; i+=2) {
            shapes.push([data[i+1], data[i]])
          }
          return shapes;
        };
        // Put the fullShape and bbox data into our object
        routeInfo[0].fullShape = shape(fullShape);
        routeInfo[0].bbox = bbox;

        // Simple template for returning a single GeoJSON feature
        var makeGeoJsonFeatures = function (type, coords, props) {
          return {
            "type": "Feature",
            "geometry": {"type": type, "coordinates": coords},
            "properties": props,
          }
        }
         
        // Return an array of GeoJSON points
        var geoJsonPoints = _.map(routeInfo[0].maneuvers, function (move) {
          var type = "Point",
              coords = [move.start.lng, move.start.lat],
              props = {
                "index": move.index,
                "cardinal": move.cardinal,
                "distance": move.distance,
                "text": move.text,
                "time": move.time,
              }
          return makeGeoJsonFeatures(type, coords, props);
        });

        // Return a single GeoJSON line
        var geoJsonLines = makeGeoJsonFeatures(
          type = "LineString",
          coords = routeInfo[0].fullShape,
          props = {
            "distance": routeInfo[0].distance,
            "time": routeInfo[0].time,
          }
        );

        // Final JSON object to return to the view
        var geoJSON = {
          "bbox": routeInfo[0].bbox,
					"totalTime": routeInfo[0].time,
					"totalDistance": routeInfo[0].distance,
          "lines": {"type": "FeatureCollection", "features": [geoJsonLines]},
          "points": {"type": "FeatureCollection", "features": geoJsonPoints},
        };

        callback(geoJSON);
      }
    })
   }
});