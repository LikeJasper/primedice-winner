Meteor.startup(function () {
  // code to run on server at startup
});

var PRIMEDICE_API_ROOT = 'https://api.primedice.com/api/';
var ACCESS_TOKEN = Meteor.settings.access_token;

Meteor.methods({
  getBalance: function () {
    return HTTP.call('GET', PRIMEDICE_API_ROOT + 'users/1?access_token=' + ACCESS_TOKEN);
  }
});
