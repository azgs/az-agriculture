var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.RouteView = Backbone.View.extend({
  initialize: function (options) {
  	this.route(options);
  },
  render: function () {},
  route: function () {
    this.model.getRoute(function (data) {
    	console.log(data);
    });
  }
});