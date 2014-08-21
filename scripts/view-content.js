var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.FarmContentView = Backbone.View.extend({
  initialize: function () {
    this.template = _.template($('#render-content-template').html());    
  },
  render: function () {
    return $(this.el).append(this.template({data: this.attributes}));
  },
  events: {
    'click .farms-contact button': 'renderDirections',
  },
  renderDirections: function () {
    var data = this.attributes;
    $('.farms-content').empty();
    
    app.routeView = new app.views.RouteView({
      el: $('.farms-content'),
      model: new app.models.Route({
        farmsData: data,
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
  }
});

app.views.MapContentView = Backbone.View.extend({
  events : {
    'click button': 'configureContent',
  },
  configureContent: function (e) {
    var view = this
      , data = this.model.get('data')
      , uid = e.currentTarget.id;

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
  renderContent: function (d) {
    app.farmContentView = new app.views.FarmContentView({
      el: $('#get-content').first(),
      attributes: d
    }).render();
  }
});