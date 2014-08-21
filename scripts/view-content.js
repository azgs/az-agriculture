var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

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
      , template;

    parent = $('#get-content').first();
    template = _.template($('#render-content-template').html());
    return parent.append(template({data: data}));
  }
});