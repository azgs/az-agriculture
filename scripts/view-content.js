var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;


app.views.NoContentView = Backbone.View.extend({      
  initialize: function () {
    var view = this;
    this.template = _.template($("#content-template").html());
  },
  render: function () {
    return $(this.el).append(this.template());
  }
})

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
  renderContent: function (data) {
    var parent
      , template
      , img
      , i
      ;

    parent = $('#get-content').first();

    app.views.FarmContentView = Backbone.View.extend({
      render: function () {
        $("#no-content-tab").remove()
        template = _.template($('#render-content-template').html());
        $(this.el).append(template({data: data}));
        $('.carousel').carousel({interval:2000});
      },
      events: {
        'click button': 'toggleDirections',
      },
      toggleDirections: function () {
        var farm;

        $('.tab-control > .btn-group > .btn').removeClass('active');
        $('#get-directions-btn').addClass('active');

        $('#get-directions').siblings().removeClass('active');
        $('#get-directions').addClass('active');

        farm = this.attributes.properties.source;
        $('#geo-destination').val(farm);
      }
    });

    app.views.farmContentView = new app.views.FarmContentView({
      el: parent,
      attributes: data,
    }).render();
  }
});