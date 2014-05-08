// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;

app.maxBounds = L.latLngBounds(
  [41.9023, -121.8164],
  [24.6870, -99.668]);

// Make a map
app.map = L.map('map', {
  maxBounds: app.maxBounds
}).fitBounds(app.maxBounds);

// Instantiate basemap model/view
app.baseMapView = new app.views.BaseMapView({
  model: new app.models.TileLayer({
    id: 'osm-basemap',
    serviceUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    serviceType: 'WMS',
    active: true,
    detectRetina: true,
  })
}).render();

// Instantiate the route model/view
app.routeView = new app.views.RouteView({
  model: new app.models.Route({
    lineOptions: {
      style: function (feature) {
        var lineStyle = {
          weight: 3,
          opacity: 1,
          color: "red",
        };
        return lineStyle;
      }
    },
    circleOptions: {
      pointToLayer: function (feature, latlng) {
        markerOptions = {
          radius: 5,
          fillColor: "red",
          color: "orange",
          weight: 3,
          opacity: 1,
          fillOpacity: 1,
        }
      return L.circleMarker(latlng, markerOptions);
      }
    }
  })
}).render();

// construct the suggestion engine
var geonamesBH = new Bloodhound({
	name: "GeoNames",
	datumTokenizer: function (d) {
		return Bloodhound.tokenizers.whitespace(d.name);
	},
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	remote: {
		url: "http://api.geonames.org/searchJSON?username=azgs&featureClass=P&maxRows=5&country=US&name_startsWith=%QUERY",
		filter: function (data) {
			return $.map(data.geonames, function (result) {
				return {
					name: result.name + ", " + result.adminCode1,
					lat: result.lat,
					lng: result.lng,
					source: "GeoNames"
				};
			});
		}
	}
});

// initialize the suggestion engine
geonamesBH.initialize();

// instantiate the typeahead UI
$("#fromLocation").typeahead({
	minLength: 2,
	highlight: true,
	hint: true
}, {
	name: "GeoNames",
	displayKey: "name",
	source: geonamesBH.ttAdapter()
});
	
// instantiate the typeahead UI
$("#toLocation").typeahead({
	minLength: 2,
	highlight: true,
	hint: true
}, {
	name: "GeoNames",
	displayKey: "name",
	source: geonamesBH.ttAdapter()
});
