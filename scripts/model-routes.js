var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

app.models.Route = Backbone.Model.extend({
  defaults: {
  	baseUrl: 'http://open.mapquestapi.com/directions/v2/route?',
  	key: 'Fmjtd%7Cluur2q01ng%2Crw%3Do5-9abxuw',
    ambiguities: 'ignore',
    generalize: '0', // Smooth out fullShape
  	from: 'Lancaster,PA', // Starting point
  	to: 'York,PA', // Destination
  },
  getRoute: function () {
  	var url = this.get('baseUrl')+'key='+this.get('key')+'&ambiguities='
              +this.get('ambiguities')+'&generalize='+this.get('generalize')
              +'&from='+this.get('from')+'&to='+this.get('to');
    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data) {
        console.log(data);
      },
      error: function (err) {
        console.log(err);
      }
    })
  },
  processRoute: function (options, callback) {
  	callback();
  }
});