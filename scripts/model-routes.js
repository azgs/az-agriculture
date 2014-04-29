var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

app.models.Route = Backbone.Models.extend({
  defaults: {
  	baseUrl: 'http://open.mapquestapi.com/directions/v2/route?',
  	key: 'Fmjtd%7Cluur2q01ng%2Crw%3Do5-9abxuw',
  	callback: 'processRoute',
  	outFormat: 'json',
  	routeType: 'undefined',
  	timeType: '1', // Current time
  	shapeFormat: 'raw', // Full float pairs for lat/long
  	generalize: '0', // No smoothing of lines
  	locale: 'en_US', // Return English
  	unit: 'm', // Return miles
  	from: 'undefined', // Starting point
  	to: 'undefined', // Destination
  	drivingStyle: '2', // Normal driving style
  },
  getRoute: function (options, callback) {
  	
  },
  processRoute: function (options, callback) {

  }
});