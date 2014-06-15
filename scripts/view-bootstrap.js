var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.NavbarView = Backbone.View.extend({
  events: {
    'click button': 'toggleButton',
  },
  toggleButton: function (e) {
    var target = $(e.currentTarget);
    var content = $('#content-tab');
    if (target.hasClass('active')) {
      target.removeClass('active');
      content.removeClass('active');
      $('.icon-bar').removeClass('active');
    } else {
      target.addClass('active');
      content.addClass('active');
      $('.icon-bar').addClass('active');
    }
  }
});

app.views.ContentView = Backbone.View.extend({
  events: {
    'click .tab-control button': 'toggleContent',
  },
  toggleContent: function (e) {
    var target = $(e.currentTarget);
    if (target.hasClass('active')) {
      target.removeClass('active');
    } else {
      $('.tab-control > .btn-group > .btn').removeClass('active');
      target.addClass('active');
    }
  }
});