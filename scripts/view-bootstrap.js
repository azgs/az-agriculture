var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.NavbarView = Backbone.View.extend({
  events: {
    'click button': 'toggleButton',
  },
  toggleButton: function (e) {
    var target = $(e.currentTarget);
    if (target.hasClass('active')) {
      target.removeClass('active');
    } else {
      target.addClass('active');
    }
  }
});

app.views.ContentView = Backbone.View.extend({
  
});