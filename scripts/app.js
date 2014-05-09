// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;

app.maxBounds = L.latLngBounds(
  [37.094259, -115.115688],
  [31.282857, -108.875454]);

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
  el: $("#contrib-form .panel-body").first(),
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

app.typeaheadView = new app.views.TypeaheadView({
	model: new app.models.Typeahead({})
}).render();
