var root = this;
root.app == null ? app = root.app = {} : app = root.app;

app.map = L.map('map', {
  center: [35.024994, -111.820046],
  zoom: 7,
});

app.baseMap = new app.models.TileLayer({
  id: 'osm-basemap',
  serviceUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  serviceType: 'WMS',
  active: true,
  detectRetina: true,
});

app.baseMapView = new app.views.BaseMapView({
  model: app.baseMap
});

app.baseMapView.render();