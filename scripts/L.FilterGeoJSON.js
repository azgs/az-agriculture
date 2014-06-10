/* 
Original concept by Mapbox: 
https://www.mapbox.com/mapbox.js/example/v1.0.0/filtering-markers/ 
Tested with Leaflet v0.7.2.
*/

L.FilterGeoJSON = L.FeatureGroup.extend({
  options: {
    filter: function () { return true; },
  },
  initialize: function (options) {
    L.setOptions(this, options);
    this._layers = {};
    this._style = options;
  },
  addJSON: function (data) {
    this.setGeoJSON(data);
  },
  setGeoJSON: function (data) {
    this._geojson = data;
    this.clearLayers();
    this.filterize(data);
    return this;
  },
  setFilter: function (f) {
    this.options.filter = f;
    if (this._geojson) {
      this.clearLayers();
      this.filterize(this._geojson);
    }
    return this;
  },
  filterize: function (json) {
    var f = L.Util.isArray(json) ? json : json.features,
        i, len;
    if (f) {
      for (i = 0, len = f.length; i < len; i++) {
        if (f[i].geometries || f[i].geometry || f[i].features) {
          this.filterize(f[i]);
        }
      }
    } else if (this.options.filter(json)) {
      var pointToLayer = this._style.pointToLayer;
      var layer = L.GeoJSON.geometryToLayer(json, pointToLayer);
      layer.feature = json;
      this.addLayer(layer);
    }
  }
});

L.filterGeoJson = function (data, options) {
  return new L.FilterGeoJSON(data, options);
};