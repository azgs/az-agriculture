// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;

app.serviceUrl = "http://localhost:3000/farms.json";
//app.serviceUrl = "http://159.87.39.12/az-agriculture/farms.json";

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
  $('.icon-bar').addClass('active');
  $('.navbar-toggle').addClass('active');
  $('#content-tab').addClass('active');
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

app.navbarView = new app.views.NavbarView({
  el: $('.navbar').first(),
}).render();

app.contentView = new app.views.ContentView({
  el: $('#content-window').first(),
}).render();

d3.json(app.serviceUrl, function (err, res) {
  if (err) console.log(err);
  if (res) {
    app.farmsView = new app.views.FarmsView({
      el: $('#toggle-layers').first(),
      model: new app.models.GeoJSONLayer({
        id: 'master-layer',
        data: res,
        active: true,
        layerOptions: {
          pointToLayer: function (f, ll) {
            var icon
              , crop
              , cropLength
              , cropType;
            
            cropLength = f.properties.crop.length;
            
            if (cropLength > 1) {
              crop = 'multi-icon';
            }
            
            if (cropLength === 1) {
              cropType = f.properties.crop[0].type;
              switch (cropType) {
                case 'Lemons':
                  crop = 'lemon-icon';
                  break;
                case 'Olives':
                  crop = 'olive-icon';
                  break;
                case 'Medjool Dates':
                  crop = 'date-icon';
                  break;
                case 'Apples':
                  crop = 'apple-icon';
                  break;
                case 'Sweet Corn':
                  crop = 'corn-icon';
                  break;
                case 'Chili Peppers':
                  crop = 'pepper-icon';
                  break;
                case 'Anaheim Chilis':
                  crop = 'pepper-icon';
                  break;
                case 'Viticultural Grapes':
                  crop = '';
                  break;
                case 'Romaine Lettue':
                  crop = 'lettuce-icon';
                  break;
                case 'Lavender':
                  crop = 'lavender-icon';
                  break;
                case 'Pumpkins':
                  crop = 'pumpkin-icon';
                  break;
                case 'Honey':
                  crop = 'honey-icon';
                  break;
              }
            }

            icon = new L.divIcon({className: crop});
            return L.marker(ll, {icon: icon});
          },
        }
      })
    }).render();

    app.mapContentView = new app.views.MapContentView({
      el: $('#map .leaflet-popup-pane'),
      model: new app.models.MapContentView({
        id: 'contentmodel',
        data: res,
      })
    }).render();

    app.routeView = new app.views.RouteView({
      el: $('#get-directions'),
      model: new app.models.Route({
        farmsData: res,
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

    var farmsTypeahead = _.map(res.features, function (f) {
      return {
        name: f.properties.source,
        source: 'Farms',
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }
    })

    app.typeaheadView = new app.views.TypeaheadView({
      model: new app.models.Typeahead({
        farmsTypeahead: farmsTypeahead,
      })
    }).render();    
  }
});