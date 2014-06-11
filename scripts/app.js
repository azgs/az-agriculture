// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;

app.intialExtent = L.latLngBounds(
  [37.094259, -115.115688],
  [31.282857, -108.875454]);

app.maxBounds = L.latLngBounds(
  [41.9023, -121.8164],
  [24.6870, -99.668]);

app.mapOptions = {
  maxBounds: app.maxBounds,
};

app.width = window.innerWidth;
if (app.width < 768) { app.mapOptions['zoomControl'] = false; };

// Make a map
app.map = L.map('map', app.mapOptions).fitBounds(app.intialExtent);

if (app.width > 768) {
  app.centerPoint = app.map.getPixelOrigin().x;
  app.offset = app.centerPoint * 0.975;
  app.pan = app.centerPoint - app.offset;
  app.map.panBy([app.pan, 0]);  
}

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

app.farmsView = new app.views.FarmsView({
  el: $('#toggle-layers').first(),
  model: new app.models.GeoJSONLayer({
    id: 'master-layer',
    serviceUrl: 'http://localhost:3000/farms.json',
    serviceType: 'JSON',
    active: true,
    layerOptions: {
      pointToLayer: function (f, ll) {
        var marker = {
          radius: 5,
          fillColor: "blue",
        }
        return L.circleMarker(ll, marker);
      },
/*
      onEachFeature: function (f, l) {
        var crops = l.feature.properties.crop;
        console.log(crops);
      }
*/
    }
  })
}).render();

// Instantiate the route model/view
app.routeView = new app.views.RouteView({
  el: $("#get-directions").first(),
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
