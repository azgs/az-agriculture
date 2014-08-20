var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.MapContentView = Backbone.View.extend({
  events : {
    'click button': 'configureContent',
  },
  configureContent: function (e) {
    var view = this;
    var data = this.model.get('data');
    var uid = e.currentTarget.id;
    _.each(data.features, function (d) {
      if (uid === String(d.properties.uid)) {
        $('#feature-content-tab').remove();

        view.renderContent(d);

        $('.icon-bar').addClass('active');
        $('.navbar-toggle').addClass('active');
        $('#content-tab').addClass('active');

        $('.tab-control > .btn-group > .btn').removeClass('active');
        $('#get-content-btn').addClass('active');

        $('#get-content').siblings().removeClass('active');
        $('#get-content').addClass('active');
      }
    });
  },
  renderContent: function (data) {
    console.log(data);
    app.routeView = new app.views.RouteView({
      el: $("#get-content").first(),
      model: new app.models.Route({
        farmData: data,
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

    var parent = $('#get-content').first();
    var template = _.template($('#render-content-template').html());

    return parent.append(template({
      data: data,
    }))
  }
});