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
        callback(routeInfo);
      },
      error: function (err) {
        console.log(err);
      }
    })
  },
  processRoute: function (options, callback) {
  	callback();
  }
});