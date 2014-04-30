var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

app.models.Route = Backbone.Model.extend({
  defaults: {
  	baseUrl: 'http://open.mapquestapi.com/directions/v2/route?',
  	key: 'Fmjtd%7Cluur2q01ng%2Crw%3Do5-9abxuw',
    ambiguities: 'ignore',
    generalize: '0', // Smooth out fullShape
  	from: 'Lancaster,PA', // Starting point
  	to: 'York,PA', // Destination
  },
  getRoute: function (callback) {
  	var url = this.get('baseUrl')+'key='+this.get('key')+'&ambiguities='
              +this.get('ambiguities')+'&generalize='+this.get('generalize')
              +'&from='+this.get('from')+'&to='+this.get('to');
    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data) {
        callback(data);
      },
      error: function (err) {
        callback(err);
      }
    })
  },
  processRoute: function (callback) {
    this.getRoute(function (data) {
      var routeInfo = _.map(data.route.legs, function (leg) {
        var maneuvers = _.map(leg.maneuvers, function (move) {
          return {
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

      var fullShape = data.route.shape.shapePoints;
      var shape = function (data) {
        var shapes = [];
        for (var i=0; i<data.length; i+=2) {
          shapes.push([data[i], data[i+1]])
        }
        return shapes;
      };
      routeInfo[0].fullShape = shape(fullShape);

      var makeGeoJsonFeatures = function (type, coords, props) {
        return {
          "type": "Feature",
          "geometry": {"type": type, "coordinates": coords},
          "properties": props,
        }
      };

      var geoJsonPoints = _.map(routeInfo[0].maneuvers, function (move) {
        var type = "Point",
            coords = [move.start.lat, move.start.lng],
            lat = move.start.lat,
            lng = move.start.lng,
            props = {
              "cardinal": move.cardinal,
              "distance": move.distance,
              "text": move.text,
              "time": move.time
            }
        return makeGeoJsonFeatures(type, coords, props);
      });

      var geoJsonLines = makeGeoJsonFeatures(
        type = "LineString",
        coords = routeInfo[0].fullShape,
        props = {
          "distance": routeInfo[0].distance,
          "time": routeInfo[0].time,
        }
      );

      var geoJSON = {
        "lines": {"type": "FeatureCollection", "features": [geoJsonLines]},
        "points": {"type": "FeatureCollection", "features": [geoJsonPoints]},
      }

      callback(geoJSON);
    })
   }
});